import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Student } from 'src/app/model/student.interface';
import { DataService } from 'src/app/shared/services/data-services/data.service';

@Component({
  selector: 'app-form-module',
  templateUrl: './form-module.component.html',
  styleUrls: ['./form-module.component.css'],
})
export class FormModuleComponent {
  isUpdatingStudent: boolean = false;
  error: string | null = null;
  constructor(
    public dialogRef: MatDialogRef<FormModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Student,
    private dataService: DataService
  ) {}
  studentForm: FormGroup = new FormGroup({
    firstName: new FormControl(this.data.firstName, [Validators.required]),
    lastName: new FormControl(this.data.lastName, [Validators.required]),
    email: new FormControl(this.data.email, [
      Validators.required,
      Validators.email,
    ]),
    mobile: new FormControl(this.data.mobileNumber, [
      Validators.required,
      Validators.pattern(/^[0-9]*$/),
    ]),
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Update Student
  updateStudent() {
    this.isUpdatingStudent = true;
    const studentObj = {
      id: this.data.id,
      firstName: this.studentForm.get('firstName')?.value,
      lastName: this.studentForm.get('lastName')?.value,
      email: this.studentForm.get('email')?.value,
      mobileNumber: this.studentForm.get('mobile')?.value,
    };

    this.dataService
      .updateStudent(studentObj)
      .then((res) => {
        this.dialogRef.close();
      })
      .catch((error) => {
        this.error = error;
        console.log(error);
      })
      .finally(() => {
        this.isUpdatingStudent = false;
      });
  }
}
