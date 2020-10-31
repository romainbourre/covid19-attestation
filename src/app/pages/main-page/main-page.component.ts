import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
import {Router} from '@angular/router';
declare var M: any;

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, AfterViewInit {

  addPeopleForm: FormGroup;
  users: User[];
  edited = false;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.createPeopleForm();
    this.loadUsers();
  }

  switchEdit(): void {
    this.edited = !this.edited;
  }

  goToGenerator(user: User): void {
    if (this.edited) {
      return;
    }

    this.router.navigate(['/', 'attestation', user.id]).then();
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
