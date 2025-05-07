import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../services/project/project.service';
import { DeviceService } from '../../../services/device/device.service';
import { Interface } from 'readline';
import { response } from 'express';
import { HttpClient } from '@angular/common/http';
import { DropdownProjectService } from '../../../services/dropdown-project/dropdown-project.service';
import { AlertService } from '../../../services/alert/alert.service';




interface Project {
  id: string;
  name: string;
  description: string;
  expanded?: boolean;
  children?: Project[];
}



interface Location {
  id: string;
  name: string;
  description?: string;
  status?:boolean;
  expanded?: boolean;
  canteens?: any[];

}



@Component({
  selector: 'app-configuration',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent {

 
  
  showDeviceList: boolean = false;
  activePage: 'projects' | 'devices' | 'object' | 'canteen' = 'projects';

  constructor(private router: Router, private route: ActivatedRoute,private projectService: ProjectService,private deviceService: DeviceService,
    private dropdownService: DropdownProjectService, private cdr: ChangeDetectorRef,private alertService:AlertService) {}

  ngOnInit() {
    // ✅ Read query parameters to determine which page to load

    this.fetchDevices();
    this.loadProjects();
    this.fetchLocations();

    this.route.queryParams.subscribe(params => {
      const page = params['page'];
      if (page === 'devices') {
        this.activePage = 'devices';
      } else {
        this.activePage = 'projects';
      }
    });

    this.loadLocations();
  }

  
  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  showProjects() {
    this.activePage = 'projects';
    this.router.navigate(['/configuration'], { queryParams: { page: 'projects' } });
  }

  openDeviceList() {
    this.activePage = 'devices';
    this.router.navigate(['/configuration'], { queryParams: { page: 'devices' } });
  }

  // Your existing modal and popup logic remains unchanged
 
  closeDevicePopup() { this.isPopupOpen = false; }

  showDeletePopup = false;
  selectedDevice: any = null;





  isDeletePopupVisible = false;
  selectedItemForDeletion: any = null;

  openDeletePopup(item: any) {
    this.selectedItemForDeletion = item;
    this.isDeletePopupVisible = true;
  }

  performDelete() {
    if (this.selectedItemForDeletion) {
      this.projects = this.projects.filter(proj => proj !== this.selectedItemForDeletion);
      this.isDeletePopupVisible = false;
      this.selectedItemForDeletion = null;
    }
  }

  closeDeletePopup() {
    this.isDeletePopupVisible = false;
    this.selectedItemForDeletion = null;
  }

  showPopup = false;
  country = '';
  desc = '';

  submit() {
    console.log('Country:', this.country);
    console.log('Description:', this.desc);
    this.showPopup = false;
  }

  reset() {
    this.country = '';
    this.desc = '';
  }
  
  // projectName = '';
  // projectDescription = '';
  weekStart = '';
  weekEnd = '';
  weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // openEditPopup() {
  //   this.isEditPopupOpen = true;
  // }

  applyChanges() {
    console.log('Project Updated:', {
      projectName: this.projectName,
      description: this.projectDescription,
      weekStart: this.weekStart,
      weekEnd: this.weekEnd
    });
    this.isEditPopupOpen = false;
  }

  clearFields() {
    this.projectName = '';
    this.projectDescription = '';
    this.weekStart = '';
    this.weekEnd = '';
  }

  hideEditCanteenPopup() {
    this.editCanteenPopupVisible = false;
  }



// devices


  devices: any[] = [];
  isPopupOpen = false;
  isEditing = false;
  selectedDevices: any | null = null;
  isAddDevice: boolean = false;


  newDevice: any = {
    id: '',
    deviceName: '',
    uniqueId: '',
    projectId: '',
    projectName: '',
    locationId: '',
    locationName: '',
    canteenId: '',
    canteenName: ''
  };



    openAddDevicePopup(): void {
      this.isAddDevice = true;
      console.log("Popup state:", this.isAddDevice); 
  }
  
    closeAddDevicePopup(): void {
      this.isAddDevice = false;
      
    }



    saveDevice(): void {
      if (!this.newDevice.deviceName || !this.newDevice.uniqueId) {
        this.alertService.showAlert("Device Name and Unique ID are required.");
        return;
      }
    
      // ✅ Ensure `id` is set correctly (preserve existing ID if editing, otherwise generate one)
      this.newDevice.id = this.newDevice.id ? this.newDevice.id : this.generateUniqueId();
    
      // ✅ Assign locationId and locationName correctly
      const selectedLocation = this.locationDrop.find(loc => loc.id === this.adddevice.location);
      this.newDevice.locationId = selectedLocation ? selectedLocation.id : '';
      this.newDevice.locationName = selectedLocation ? selectedLocation.name : '';
    
      // ✅ Assign canteenId and canteenName correctly
      const selectedCanteen = this.canteenDrop.find(can => can.id === this.selectedCanteenId);
      this.newDevice.canteenId = selectedCanteen ? selectedCanteen.id : '';
      this.newDevice.canteenName = selectedCanteen ? selectedCanteen.name : '';
    
      // ✅ Remove unwanted fields
      const requestBody = {
        id: "",
        deviceName: this.newDevice.deviceName,
        uniqueId: this.newDevice.uniqueId,
        locationId: this.newDevice.locationId,
        locationName: this.newDevice.locationName,
        canteenId: this.newDevice.canteenId,
        canteenName: this.newDevice.canteenName
      };
    
      console.log("Device Payload Sent to API:", requestBody);
    
      this.deviceService.addDevice(requestBody).subscribe(
        (response) => {
          console.log('Device added successfully:', response);
          this.alertService.showAlert("Device added successfully");
          this.closeAddDevicePopup();
    
          // ✅ Reset form fields properly
          this.newDevice = {
            id: '',
            deviceName: '',
            uniqueId: '',
            locationId: '',
            locationName: '',
            canteenId: '',
            canteenName: ''
          };
    
          this.adddevice.location = '';
          this.selectedCanteenId = null;
          this.canteenDrop = [];
    
          // ✅ Refresh device list
          this.fetchDevices();
        },
        (error) => {
          console.error("Error adding device:", error);
          this.alertService.showAlert("Error adding device. Check console for details.","error");
        }
      );
    }
    
    // ✅ Generate Unique ID (if needed)
    generateUniqueId(): string {
      return Math.random().toString(36).substr(2, 24);
    }
    
    
    
    
    


  fetchDevices(): void {
    this.deviceService.getDevices().subscribe(
      (response: any[]) => {
        this.devices = response.reverse();

  this.deviceTotalItems = this.devices.length;
  this.deviceCurrentPage = 1;
  this.updateDevicePagination();
      },
      (error) => {
        console.error('Error fetching devices:', error);
      }
    );
  }

  openDevicePopup() {
    this.isPopupOpen = true;
  }

  closeDeviceEditPopup(): void {
    this.isPopupOpen = false;
    this.isEditing = false;
    this.selectedDevices = null;
  }

  openDeviceEditPopup(device: any): void {
    this.selectedDevices = { ...device };
    this.isEditing = true;

     // ✅ Assign the existing location and canteen ID values
  this.adddevice.location = device.locationId;
 // ✅ Load canteens based on the selected location
 this.loadCanteens();

 // ✅ Wait briefly to ensure canteens are loaded before setting selectedCanteenId
 setTimeout(() => {
   this.selectedCanteenId = device.canteenId;
 }, 200); // Adjust timeout as needed
 


    this.isPopupOpen = true;

   
  }


  saveUpdatedDevice(): void {
    if (!this.selectedDevices || !this.selectedDevices.uniqueId) {
      this.alertService.showAlert("Unique ID is required for update.","error");
      return;
    }
  
    // ✅ Assign selected values
    const selectedLocation = this.locationDrop.find(loc => loc.id === this.adddevice.location);
    this.selectedDevices.locationId = selectedLocation ? selectedLocation.id : this.selectedDevices.locationId;
    this.selectedDevices.locationName = selectedLocation ? selectedLocation.name : this.selectedDevices.locationName;
  
    const selectedCanteen = this.canteenDrop.find(can => can.id === this.selectedCanteenId);
    this.selectedDevices.canteenId = selectedCanteen ? selectedCanteen.id : this.selectedDevices.canteenId;
    this.selectedDevices.canteenName = selectedCanteen ? selectedCanteen.name : this.selectedDevices.canteenName;
  
    const updatedDeviceData = {
      id: this.selectedDevices.id,
      deviceName: this.selectedDevices.deviceName,
      uniqueId: this.selectedDevices.uniqueId,
      locationId: this.selectedDevices.locationId,
      locationName: this.selectedDevices.locationName,
      canteenId: this.selectedDevices.canteenId,
      canteenName: this.selectedDevices.canteenName
    };
  
    console.log("Updated Device Payload Sent to API:", updatedDeviceData);
  
    this.deviceService.updateDevice(updatedDeviceData).subscribe(
      (response) => {
        console.log("Device updated successfully:", response);
        this.alertService.showAlert("Device updated successfully!");
  
        const index = this.devices.findIndex(d => d.id === response.id);
        if (index !== -1) {
          this.devices[index] = response;
        }
  
        this.closeDeviceEditPopup();
        this.fetchDevices();
      },
      (error) => {
        console.error("Error updating device:", error);
        this.alertService.showAlert("Error updating device. Check console for details.","error");
      }
    );
  }
  
  
  

  // delete device
  showDeleteDevicePopup: boolean = false;


  openDeleteDevicePopup(device: any): void {
    console.log("Open Delete Popup Clicked!", device);
    this.selectedDevice = device;  
    this.showDeleteDevicePopup = true;  
  }
  
  closeDeleteDevicePopup(): void {
    this.showDeleteDevicePopup = false;
  }
  
  confirmDeleteDevice(): void {
    if (!this.selectedDevice) return;
    this.deviceService.deleteDevice(this.selectedDevice.uniqueId).subscribe(
      (response) => {
        this.devices = this.devices.filter(d => d.uniqueId !== this.selectedDevice.uniqueId);
        this.closeDeleteDevicePopup();
        this.alertService.showAlert("device deleted successfully");
      },
      (error) => {
        console.error('Error deleting device:', error);
      }
    );
  }
  


  // project

  isModalOpen = false;
  projectData = {
    id: '',
    name: '',
    description: ''
  };



  openModal() {
    this.isModalOpen = true;
    this.projectData = { id: '', name: '', description: '' }; 
  }

  closeModal() {
    this.isModalOpen = false;
    this.projectData = { id: '', name: '', description: '' }; 
   
  }

  clearForm() {
    this.projectData = { id: '', name: '', description: '' };
  }


 
  projects: any[] = [];


  isEditPopupOpen = false;
  projectId = '';
  projectName = '';
  projectDescription = '';

 

  openEditPopup(project: any) {
    this.isEditPopupOpen = true;
    this.projectId = project.id;
    this.projectName = project.name;
    this.projectDescription = project.description;
  
  }

  closeEdit() {
    this.isEditPopupOpen = false;

  }

selectedProject: any = null; 

// Open modal and set the selected project
openLocModal(project: any) {
  console.log("Opening Add Location Popup for Project:", project); 
  this.selectedProject = project; 
  // this.locationName = '';
  this.locationData.name='';
  this.locShowPopup = true;
}

// EditlocShowPopup: boolean = false;
selectedLocation: any = null;


openEditLocModal(location: { id: string; name: string }, project: { id: string; name: string }) {
  console.log("Opening Edit Modal for Location:", location, "Project:", project);

  if (!location.id) {
    console.error("Location ID is missing!", location);
    return;
  }

  this.EditlocShowPopup = true;
  this.selectedLocation = location;
  // this.locationName = location.name;
  this.locationData.name=location.name;
  this.selectedProject = { id: project.id, name: project.name };
}



// canteen 


// ✅ Popup state variables
addCanteenPopupVisible: boolean = false;
editCanteenPopupVisible: boolean = false;

// ✅ Store canteen data in an object (similar to locationData)
canteenData = {
  id: '',
  name: '',
  locationId: '',
  description: '',
  status: true  // ✅ Default to true
};

// ✅ Open Add Canteen Popup
openAddCanteenPopup(location: any) {
  if (!location || !location.id) {
    console.error("Invalid location selected:", location);
    this.alertService.showAlert("Please select a valid location before adding a canteen.","error");
    return;
  }

  console.log("Setting selected location:", location);
  this.selectedLocation = location;
  this.addCanteenPopupVisible = true;

  // ✅ Reset form before adding new canteen
  this.resetCanteenForm();
}

// ✅ Save New Canteen
saveCanteenChanges() {
  if (!this.canteenData.name.trim() || !this.canteenData.description.trim()) {
    this.alertService.showAlert("Please fill all the details.","error");
    return;
  }

  console.log("Selected Location:", this.selectedLocation);
  console.log("Selected Location ID:", this.selectedLocation?.id);

  if (!this.selectedLocation || !this.selectedLocation.id) {
    this.alertService.showAlert("Please select a valid location.","error");
    return;
  }

  const newCanteen = {
    id: "", // ✅ New canteen, so ID is empty
    name: this.canteenData.name,
    locationId: this.selectedLocation.id,
    description: this.canteenData.description,
    status: !!this.canteenData.status // ✅ Ensure status is always boolean
  };

  this.projectService.addCanteen(newCanteen).subscribe({
    next: (response) => {
     
      this.alertService.showAlert(response.message);
      this.addCanteenPopupVisible = false;

      this.fetchCanteens(this.selectedLocation.id);

      // ✅ Reset form after adding
      this.resetCanteenForm();
    },

    error: (response) => {
      if (response.status === 400) {
        this.alertService.showAlert(response.error?.message || "Bad Request","error");
      } else {
        this.alertService.showAlert("An unexpected error occurred.","error");
      }
    }
    
    
  });
}

// ✅ Reset Form Fields
resetCanteenForm() {
  this.canteenData = { id: '', name: '', locationId:'',description: '', status: true };
}

// ✅ Close Canteen Popup
closeCanteenPopup() {
  this.addCanteenPopupVisible = false;
  this.resetCanteenForm();
}






// ✅ Open Edit Canteen Popup
openEditCanteenPopup(canteen: any) {
  if (!canteen) {
    console.error("Invalid canteen selected:", canteen);
    this.alertService.showAlert("Error: Invalid canteen.","error");
    return;
  }

  
  // this.canteenData = { ...canteen };

  this.canteenData = {
    id: canteen.id ,
    name: canteen.name ,
    locationId: canteen.locationId ,
    description: '', 
    status: canteen.status !== undefined ? canteen.status : true // ✅ Ensure boolean value
  };

  this.editCanteenPopupVisible = true;
  setTimeout(() => {
    this.canteenData.description = canteen.description || '';
    console.log("Updated Canteen Description:", this.canteenData.description);
  }, 200);
}

// ✅ Save Edited Canteen
editCanteen() {
  if (!this.canteenData.name.trim() || !this.canteenData.description.trim()) {
    this.alertService.showAlert("Please fill all the details.","error");
    return;
  }

  const updatedCanteen = {
    id: this.canteenData.id,
    name: this.canteenData.name,
    locationId: this.canteenData.locationId,
    description: this.canteenData.description,
    status: !!this.canteenData.status // ✅ Ensure status is always boolean
  };

  this.projectService.updateCanteen(updatedCanteen.id, updatedCanteen).subscribe({
    next: (response) => {
      console.log("Canteen updated successfully:", response);
      this.alertService.showAlert("Canteen updated successfully!");
      this.editCanteenPopupVisible = false;

      // ✅ Refresh canteen list after update
      this.fetchCanteens(updatedCanteen.locationId);
    },
    error: (error) => {
      console.error("Error updating canteen:", error);
      this.alertService.showAlert("Failed to update canteen. Check console for details.","error");
    }
  });
}

// ✅ Close Edit Canteen Popup
closeEditCanteen() {
  this.editCanteenPopupVisible = false;
}



projectDrop: any[] = [];
locationDrop: any[] = [];
canteenDrop: any[] = [];
selectedProjectId:  number | null = null;
selectedLocationId: number | null = null;
selectedCanteenId: number | null = null;







loadProjects(): void {
  if (this.projectDrop.length === 0) { // Avoid unnecessary API calls
    this.dropdownService.getProjects().subscribe({
      next: (data) => {
        this.projectDrop = data;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      }
    });
  }
}




//new 

// locations: Location[] = [];
selectedCanteens: Set<string> = new Set();



fetchLocations(): void {
  this.projectService.getLocationSummary().subscribe(
    (response: Location[]) => {
      this.locations = response.map(loc => ({
        // ...loc,
        id: loc.id,
        name: loc.name,
        description: loc.description ? loc.description : '', 
        status:loc.status,
        expanded: false,
        canteens: []
      }));
    },
    (error) => {
      console.error('Error fetching locations:', error);
    }
  );
}

toggleDropdown(location: Location) {
  location.expanded = !location.expanded;

  if (location.expanded && location.canteens?.length === 0) {
    this.fetchCanteens(location.id);
  }
}



fetchCanteens(locationId: string) {
  this.projectService.getCanteensByLocation(locationId).subscribe(
    (canteens) => {
      const location = this.locations.find(loc => loc.id === locationId);
      if (location) {
        location.canteens = [...canteens]; // ✅ Ensure reference update for Angular change detection
      }
    },
    (error) => {
      console.error("Error fetching canteens:", error);
    }
  );
}


selectCanteen(canteen: any) {
  if (this.selectedCanteens.has(canteen.name)) {
    this.selectedCanteens.delete(canteen.name);
  } else {
    this.selectedCanteens.add(canteen.name);
  }
}

isCanteenSelected(canteenName: string): boolean {
  return this.selectedCanteens.has(canteenName);
}


// add locations 



locShowPopup = false;

locationData = {
  id: '',
  name: '',
  description: '',
  status: true  // ✅ Default to true
};

addLoc() {
  if (!this.locationData.name.trim()) {
    this.alertService.showAlert('Please enter a location name',"error");
    return;
  }

  const requestData = {
    id: "",
    name: this.locationData.name,
    description: this.locationData.description,  
    status: !!this.locationData.status  // ✅ Ensure status is always boolean
  };

  this.projectService.addLocation(requestData).subscribe(
    response => {
      this.alertService.showAlert('Location added successfully');
      this.locShowPopup = false;
      this.resetForm();
      this.fetchLocations();
    },
    error => {
      console.error('Error adding location', error);
      this.alertService.showAlert('Failed to add location',"error");
    }
  );
}

canLoc() {
  this.locShowPopup = false;
  this.resetForm();
}

resetForm() {
  this.locationData = { id: '', name: '', description: '', status: true };  // ✅ Reset properly
}

openLocationPopup() {
  this.locShowPopup = true;
}

  




  
//update locations 

  EditlocShowPopup = false;

  editingLocationId: string | null = null;

  locations: any[] = [];

  openEditLocationPopup(location: any) {
    console.log("Editing location:", location); 
    this.EditlocShowPopup = true;

    // ✅ Copy location data properly
    this.locationData = { 
      id: location.id,
      name: location.name,
      description:'',
      status: location.status
    };

    this.editingLocationId = location.id;

    setTimeout(() => {
      this.locationData.description = location.description || '';
      console.log("Updated Location Description:", this.locationData.description);
    }, 200);
  }

  canEditLoc() {
    this.EditlocShowPopup = false;
    this.resetForm1();
  }

  updateLoc() {
    if (!this.editingLocationId || !this.locationData.name.trim()) {
      this.alertService.showAlert('Invalid location data',"error");
      return;
    }

    const updatedLocation = { 
      id: this.editingLocationId,
      name: this.locationData.name,
      description: this.locationData.description || '',
      status: this.locationData.status // ✅ Ensure status is included
    };

    this.projectService.updateLocation(this.editingLocationId, updatedLocation).subscribe({
      next: () => {
        this.alertService.showAlert('Location updated successfully!');
        this.EditlocShowPopup = false;
        this.resetForm1();
        this.fetchLocations(); // ✅ Refresh locations
      },
      error: (response) => {
        if (response.status === 400) {
          this.alertService.showAlert(response.error?.message || "Bad Request","error");
        } else {
          this.alertService.showAlert("An unexpected error occurred.","error");
        }
      }
    });
  }

  resetForm1() {
    this.locationData = { id: '', name: '', description: '', status: true };
    this.editingLocationId = null;
  }

  



  adddevice = {
    
    location: '',
  }
  
  
  loadLocations(): void {
    this.dropdownService.getLocations().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.locationDrop = data;
          console.log("Locations loaded:", this.locationDrop); // ✅ Debugging
        } else {
          console.warn("No locations found!"); // ✅ Handle empty data
        }
      },
      error: (err) => {
        console.error('Error fetching locations:', err);
      }
    });
  }



loadCanteens(): void {
    if (!this.adddevice.location) {
        console.warn("No location selected!"); // ✅ Prevents API call if no location is chosen
        return;
    }

    const locationId = this.adddevice.location; // Get selected location ID
    this.dropdownService.getCanteens(locationId).subscribe({
        next: (data) => {
            if (data && data.length > 0) {
                this.canteenDrop = data;
                console.log("Canteens loaded:", this.canteenDrop); // ✅ Debugging
            } else {
                console.warn("No canteens found for this location!"); // ✅ Handle empty data
                this.canteenDrop = []; // Clear previous data
            }
        },
        error: (err) => {
            console.error('Error fetching canteens:', err);
        }
    });
}






//delete canteen

isDeleteCanteenPopupVisible: boolean = false;
canteenToDeleteId: string | null = null;

// ✅ Open Delete Canteen Confirmation Popup
openDeleteCanteenPopup(canteenId: string) {
  this.canteenToDeleteId = canteenId;
  this.isDeleteCanteenPopupVisible = true;
}

// ✅ Close Delete Canteen Popup
closeDeleteCanteen() {
  this.isDeleteCanteenPopupVisible = false;
  this.canteenToDeleteId = null;
}

// ✅ Delete Canteen
deleteCanteen() {
  if (!this.canteenToDeleteId) {
    alert("Canteen ID is missing!");
    return;
  }

  this.projectService.deleteCanteenById(this.canteenToDeleteId).subscribe({
    next: () => {
      this.alertService.showAlert("Canteen deleted successfully!");
      this.isDeleteCanteenPopupVisible = false;

      // ✅ Refresh the canteen list
      this.fetchCanteens(this.selectedLocation.id);

      this.canteenToDeleteId = null;
    },
    error: (error) => {
      console.error("Error deleting canteen:", error);
      this.alertService.showAlert("Failed to delete canteen.","error");
    }
  });
}

//delete location

isDeleteLocPopupVisible: boolean = false;
locationToDeleteId: string | null = null;

// ✅ Open Delete Location Confirmation Popup
openDeleteLocPopup(locationId: string) {
  this.locationToDeleteId = locationId;
  this.isDeleteLocPopupVisible = true;
}

// ✅ Close Delete Location Popup
closeDeleteLoc() {
  this.isDeleteLocPopupVisible = false;
  this.locationToDeleteId = null;
}

// ✅ Delete Location
deleteLoc() {
  if (!this.locationToDeleteId) {
    this.alertService.showAlert("Location ID is missing!","error");
    return;
  }

  this.projectService.deleteLocationById(this.locationToDeleteId).subscribe({
    next: () => {
      this.alertService.showAlert("Location deleted successfully!");
      this.isDeleteLocPopupVisible = false;

      // ✅ Refresh location list after deletion
      this.fetchLocations();

      this.locationToDeleteId = null;
    },
    error: (response) => {
      if (response.status === 400) {
        this.alertService.showAlert(response.error?.message || "Bad Request","error");
      } else {
        this.alertService.showAlert("An unexpected error occurred.","error");
      }
    }
  });
}






pagedDeviceList: any[] = [];

deviceCurrentPage: number = 1;
deviceItemsPerPage: number = 10;
devicePageSizes: number[] = [5, 10, 20, 50];

deviceTotalItems: number = 0;
deviceStartIndex: number = 0;
deviceEndIndex: number = 0;




updateDevicePagination() {
  const start = (this.deviceCurrentPage - 1) * this.deviceItemsPerPage;
  const end = start + this.deviceItemsPerPage;

  this.pagedDeviceList = this.devices.slice(start, end);
  this.deviceStartIndex = start + 1;
  this.deviceEndIndex = Math.min(end, this.deviceTotalItems);
}

onDevicePageSizeChange() {
  this.deviceCurrentPage = 1;
  this.updateDevicePagination();
}

goToNextDevicePage() {
  if (this.deviceEndIndex < this.deviceTotalItems) {
    this.deviceCurrentPage++;
    this.updateDevicePagination();
  }
}

goToPreviousDevicePage() {
  if (this.deviceCurrentPage > 1) {
    this.deviceCurrentPage--;
    this.updateDevicePagination();
  }
}

}
 




















