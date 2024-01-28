import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Student } from 'src/app/model/student.interface';
import { AuthService } from 'src/app/shared/services/auth-service/auth.service';
import { DataService } from 'src/app/shared/services/data-services/data.service';
import { FormModuleComponent } from '../form-module/form-module.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  isLogged: boolean = false;
  currentUser: any = null;
  userName: string = '';
  isStudentsDataLoading: boolean = false;
  isDeleting: boolean = false;
  isAddingStudent: boolean = false;
  studentForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobile: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]*$/),
    ]),
  });

  // Table Datas
  displayedColumns: string[] = [
    'position',
    'firstName',
    'lastName',
    'email',
    'mobileNumber',
    'edit',
    'delete',
  ];
  studentsDataSource: Student[] = [];

  animal: string = '';
  name: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private data: DataService,
    public dialog: MatDialog
  ) {
    this.isLogged = JSON.parse(localStorage.getItem('jwt') as any);
    if (this.isLogged) {
      this.auth.getCurrentUser().subscribe((res) => {
        if (!res?.emailVerified) {
          this.router.navigate(['/login']);
        } else {
          this.currentUser = { email: res.email };
          this.createUserNameByEmail(this.currentUser.email);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  // NgOnInit
  ngOnInit() {
    this.getAllStudents();
  }

  openDialog(student: Student): void {
    const dialogRef = this.dialog.open(FormModuleComponent, {
      data: student,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  editBtn(student: any) {
    console.log(student);
  }

  // Get All Students
  getAllStudents() {
    this.isStudentsDataLoading = true;
    this.data.getAllStudents().subscribe((res) => {
      this.studentsDataSource = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      });
      this.isStudentsDataLoading = false;
    });
  }

  // Add New Student
  addStudent() {
    if (this.studentForm.valid) {
      this.isAddingStudent = true;
      const studentObj: Student = {
        id: '',
        firstName: this.studentForm.get('firstName')?.value,
        lastName: this.studentForm.get('lastName')?.value,
        email: this.studentForm.get('email')?.value,
        mobileNumber: this.studentForm.get('mobile')?.value,
      };

      this.data
        .addStudentData(studentObj)
        .then((res) => {
          this.clearFormInputs();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isAddingStudent = false;
        });
    } else {
      return;
    }
  }

  // delete Student
  deleteStudent(student: Student) {
    if (
      window.confirm(
        `Are you sure you want to delete ${student.firstName} ${student.lastName}`
      )
    ) {
      this.isDeleting = true;
      this.data
        .deleteStudent(student.id)
        .then((res) => {})
        .catch((error) => {})
        .finally(() => {
          this.isDeleting = false;
        });
    }
  }

  //  Sign Out
  signout() {
    this.auth.signOut();
  }

  createUserNameByEmail(email: string) {
    const emailArr = email?.split('');
    if (emailArr) {
      for (let a of emailArr) {
        if (a === '@') {
          break;
        }
        this.userName += a;
      }
    }
  }

  clearFormInputs() {
    this.studentForm.reset();
    const allControls = this.studentForm.controls;
    for (const key in allControls) {
      this.studentForm.controls[key].setErrors(null);
    }
  }
}
