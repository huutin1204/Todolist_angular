import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from "firebase/compat/app";
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(
    private afs : AngularFirestore,
    private toastr : ToastrService
    ) { }

    saveTodo(id : string, data : any){

      this.afs.collection('categories').doc(id).collection('todos').add(data).then(ref => {
        this.afs.doc('categories/' + id ).update({todoCount : firebase.firestore.FieldValue.increment(1)});
        this.toastr.success('New Todo Save Successfully !');
      });
    }

    loadCategories(){
      return this.afs.collection('categories').snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {data , id};
          })
        })
      );
    }
    LoadTodos(id : string){
      return this.afs.collection('categories').doc(id).collection('todos').snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {data , id};
          })
        })
      );
    }

    updateTodo(catId : string, todoId: string, updatedData : string){
      this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).update({todo: updatedData }).then(() =>{
        this.toastr.success('Todo Updated Successfully !');
      })
    }

    deleteTodo(catId : string, todoId : string){
      this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).delete().then(() =>{
        this.afs.doc('categories/' + catId ).update({todoCount : firebase.firestore.FieldValue.increment(-  1)});

        this.toastr.success('Todo Deleted Successfully !');
      })
    }

    markComplete(catId : string, todoId : string){
        this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).update({isCompleted : true}).then(() =>{
          this.afs.doc('categories/' + catId ).update({todoCount : firebase.firestore.FieldValue.increment(-  1)});
  
          this.toastr.success('Todo Marked Completed !');
        })
    }

    markUncomplete(catId : string, todoId : string){
      this.afs.collection('categories').doc(catId).collection('todos').doc(todoId).update({isCompleted : false}).then(() =>{
        this.afs.doc('categories/' + catId ).update({todoCount : firebase.firestore.FieldValue.increment(-  1)});

        this.toastr.success('Todo Marked Uncompleted !');
      })
  }
}
