import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Student } from 'src/app/model/student.interface';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private angularFirestore: AngularFirestore) {}

  // Add Student
  addStudentData(student: Student) {
    student.id = this.angularFirestore.createId();
    return this.angularFirestore.collection('/Students').add(student);
  }

  // Get All Students
  getAllStudents() {
    return this.angularFirestore.collection('/Students').snapshotChanges();
  }

  // Delete Student
  deleteStudent(studentID: string) {
    return this.angularFirestore.doc(`/Students/${studentID}`).delete();
  }

  // Update Student
  updateStudent(student: Student) {
    const studentID = student.id;
    const { firstName, lastName, email, mobileNumber } = student;
    const modifiedStudent = { firstName, lastName, email, mobileNumber };
    return this.angularFirestore
      .doc(`/Students/${studentID}`)
      .update(modifiedStudent);
  }
}
