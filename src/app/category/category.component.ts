import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoryService } from '../service/category.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  color : Array<any> = ['#F9CEEE','#F9F3EE','#CCF3EE','#97C4B8'];
  
  categories: Array<any> = [];

  categoryName : string = '';

  dataStatus: string = 'Add';

  catId : string ='';

  constructor(private categoryService : CategoryService) { }

  ngOnInit(): void {

    this.categoryService.loadCategories().subscribe(val => {
      this.categories = val;
      console.log(val);
    })

  }

  onSubmit(f:NgForm){
    if(this.dataStatus == "Add"){
      let randomNumber = Math.floor(Math.random() * this.color.length );

      let todoCategory = {
        category: f.value.categoryName,
        colorCode : this.color[randomNumber],
        todoCount: 0
      }
      this.categoryService.saveCategory(todoCategory);
    }

    else if(this.dataStatus =="Edit"){
      this.categoryService.updateCategory(this.catId, f.value.categoryName);     
      f.resetForm();
      this.dataStatus ="Add";
    }
  }

  onEdit(category : string, id: string){
    this.categoryName = category;
    this.dataStatus = "Edit";
    this.catId = id;
  }

  onDelete(id : string){
    this.categoryService.deleteCategory(id);
  }
}
