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
              private router: Router) {
  }

  ngOnInit(): void {
    this.createPeopleForm();
    this.loadUsers();
  }

  hasNoUser() {
    return this.users.length === 0;
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

  deleteUser(user: User) {
    this.userService.delete(user);
    this.loadUsers();
  }

  onSubmit() {
    if (this.addPeopleForm.valid) {
      this.userService.add(this.addPeopleForm.value);
      this.loadUsers();
      this.addPeopleForm.reset();
    }
  }

  ngAfterViewInit(): void {
    const options = {
      startingTop: '1%',
      endingTop: '1%'
    };

    const elements = document.querySelectorAll('.modal');
    M.Modal.init(elements, options);
  }

  private loadUsers() {
    this.userService.getAll().subscribe(users => this.users = users);
  }

  private createPeopleForm() {
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

  private checkValue(str, max) {
    if (str.charAt(0) !== '0' || str === '00') {
      let num = parseInt(str, 0);
      if (isNaN(num) || num <= 0 || num > max) {
        num = 1;
      }
      str = num > parseInt(max.toString().charAt(0), 0)
      && num.toString().length === 1 ? '0' + num : num.toString();
    }

    return str;
  }

  onBirthDateChange() {
    let input = this.addPeopleForm.controls.birthDate.value;

    if (/\D\/$/.test(input)) {
      input = input.substr(0, input.length - 3);
    }

    const values = input.split('/').map((v: string) => {
      return v.replace(/\D/g, '');
    });

    if (values[0]) {
      values[0] = this.checkValue(values[0], 12);
    }

    if (values[1]) {
      values[1] = this.checkValue(values[1], 31);
    }

    const output = values.map((v: string, i: number) => {
      return v.length === 2 && i < 2 ? v + '/' : v;
    });

    this.addPeopleForm.controls.birthDate.setValue(output.join('').substr(0, 14));
  }
}
