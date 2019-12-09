import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { UtilService } from 'src/app/services/util.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit, OnDestroy{

  public user: User;
  
  public authSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private utilService: UtilService) {}

  ngOnInit(){

    this.authSubscription = this.authService.getAuthStateSubject().subscribe((state) =>{
      //Do one time stuff on login here. i.e when state changes from false to true;
      if(state){
        this.authService.getUser().then((user) =>{
          this.user = user;
        })
        .catch((err) => console.log(err));
      }
    });
  }

  public logout(){
    this.utilService.presentAlertConfirm('Leaving soon?', 'Are you sure you want to log out?', () =>{
      this.authService.logout();
    });
  }

  ngOnDestroy(){
    this.authSubscription.unsubscribe();
  }
}
