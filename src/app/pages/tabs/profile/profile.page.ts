import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit{

  public user: User;

  constructor(
    private authService: AuthService,
    private utilService: UtilService) {}

  ngOnInit(){
    this.authService.getUser().then((user) =>{
      this.user = user;
    })
    .catch((err) => console.log(err));
  }

  public logout(){
    this.utilService.presentAlertConfirm('Leaving soon?', 'Are you sure you want to log out?', () =>{
      this.authService.logout();
    });
  }
}
