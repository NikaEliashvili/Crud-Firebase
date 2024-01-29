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
  isStudentsDataLoading: boolean = false;
  isDeleting: boolean = false;
  isAddingStudent: boolean = false;
  hasCurrentUser: boolean = false;
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

  constructor(
    private auth: AuthService,
    private router: Router,
    private data: DataService,
    public dialog: MatDialog
  ) {
    this.isLogged = JSON.parse(localStorage.getItem('jwt') as any);
    if (this.isLogged) {
      this.hasCurrentUser = true;
      this.auth.getCurrentUser().subscribe((res) => {
        this.hasCurrentUser = false;
        if (!res?.emailVerified) {
          this.router.navigate(['/login']);
        } else {
          console.log(res.uid);
          this.getAllStudents(res?.uid);
          this.currentUser = { email: res.email, userId: res.uid };
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  // NgOnInit
  ngOnInit() {
    if (this.currentUser?.userId) {
      console.log(this.currentUser.userId);
      this.getAllStudents(this.currentUser.userId);
    }
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
  getAllStudents(userId: string) {
    this.isStudentsDataLoading = true;
    this.data.getAllStudentsByUserId(userId).subscribe(
      (students: Student[]) => {
        this.studentsDataSource = students;
        this.isStudentsDataLoading = false;
      },
      (error) => {
        this.isStudentsDataLoading = false;
      }
    );
  }

  // Add New Student
  addStudent() {
    if (this.studentForm.valid && this.currentUser.userId) {
      this.isAddingStudent = true;
      const studentObj: Student = {
        id: '',
        userId: this.currentUser.userId,
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

  clearFormInputs() {
    this.studentForm.reset();
    const allControls = this.studentForm.controls;
    for (const key in allControls) {
      this.studentForm.controls[key].setErrors(null);
    }
  }
}
