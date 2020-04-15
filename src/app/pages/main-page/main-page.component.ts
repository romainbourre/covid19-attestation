import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
declare var M: any;

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, AfterViewInit {

  addPeopleForm: FormGroup;
  users: User[];

  constructor(private fb: FormBuilder,
              private userService: UserService) { }

  ngOnInit(): void {
    this.createPeopleForm();
    this.loadUsers();
  }

  public hasNoUser() {
    return this.users.length === 0;
  }

  private loadUsers() {
    this.userService.getAll().subscribe(users => this.users = users);
  }

  public createPeopleForm() {
    this.addPeopleForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['', Validators.required],
      birthPlace: ['', Validators.required],
      address: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  public deleteUser(user: User) {
    this.userService.delete(user);
    this.loadUsers();
  }

  public onSubmit() {
    if (this.addPeopleForm.valid) {
      this.userService.add(this.addPeopleForm.value);
      this.loadUsers();
      this.addPeopleForm.reset();
    }
  }

  ngAfterViewInit(): void {
    const elements = document.querySelectorAll('.modal');
    M.Modal.init(elements, null);
  }
}
