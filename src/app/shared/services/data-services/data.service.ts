import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { Student } from 'src/app/model/student.interface';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private angularFirestore: AngularFirestore) {}

  // Add Student
  addStudentData(student: Student) {
    student.id = this.angularFirestore.createId();
    const { firstName, lastName, email, mobileNumber, userId } = student;
    const modifiedStudent = {
      firstName,
      lastName,
      email,
      mobileNumber,
      userId,
    };
    return this.angularFirestore.collection('/Students').add(modifiedStudent);
  }

  // Get All Students
  getAllStudentsByUserId(userId: string): Observable<Student[]> {
    const queryFn: QueryFn = (ref) => ref.where('userId', '==', userId);
    return this.angularFirestore
      .collection('/Students', queryFn)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          console.log('Actions:', actions); // Log actions array
          return actions.map((action) => {
            const data = action.payload.doc.data() as Student;
            console.log(data);

            const id = action.payload.doc.id;
            return { ...data, id };
          });
        })
      );
  }

  // getAllStudentsByUserId(userId: string) {
  //   return this.angularFirestore.collection('/Students').snapshotChanges();
  // }

  // Delete Student
  deleteStudent(studentID: string) {
    return this.angularFirestore.doc(`/Students/${studentID}`).delete();
  }

  // Update Student
  updateStudent(student: Student) {
    const studentID = student.id;
    const { firstName, lastName, email, mobileNumber, userId } = student;
    const modifiedStudent = {
      firstName,
      lastName,
      email,
      mobileNumber,
      userId,
    };
    return this.angularFirestore
      .doc(`/Students/${studentID}`)
      .update(modifiedStudent);
  }
}
