import { Injectable, inject } from '@angular/core';
import { User } from '../interface/user';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Firestore, QuerySnapshot, addDoc, collection, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { distinctUntilChanged, fromEvent, tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class LoginService {

  firestore: Firestore = inject(Firestore);
  name: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  passwordLogin: string = '';
  password1: string = '';
  password2: string = '';
  allUsers: User[] = [];
  samePw: boolean = false;
  currentUser: string = '';
  errorMessage: string = '';
  loginBoolean: boolean = false;
  lastActivityTimestamp: number = 0;
  autoLogoutTimer: number | null = null;

  constructor(private route: Router,) {
    this.startAutoLogoutTimer();
  }

  // startAutoLogoutTimer() {
  //   const timeout = 20 * 60 * 1000; // 20 minutes in milliseconds

  //   // Create an observable to track user activity
  //   const userActivityObservable = fromEvent(document, 'mousemove')
  //     .pipe(
  //       distinctUntilChanged(), // Ignore consecutive mousemove events
  //       tap(() => {
  //         this.lastActivityTimestamp = Date.now(); // Update timestamp on activity
  //       })
  //     );

  //   // Subscribe to the observable and update the timer accordingly
  //   userActivityObservable.subscribe(() => {
  //     if (this.autoLogoutTimer) {
  //       clearTimeout(this.autoLogoutTimer); // Clear existing timer
  //     }

  //     this.autoLogoutTimer = setTimeout(() => {
  //       this.deleteUserIdInLocalStorage();
  //     }, timeout) as unknown as number;
  //   });
  // }


  startAutoLogoutTimer() {
    const timeout = 20 * 60 * 1000; // 20 minutes in milliseconds
    setTimeout(() => {
      localStorage.removeItem('currentUser');
    }, timeout);
  }


  //--------------- register new user -------------------------------------------------
  register() {
    if (this.loginBoolean) {
      this.getFirstAndLastName();
      const auth = getAuth();
      const password = this.checkPW();
      if (!this.samePw) {
        console.error('Passwords do not match');
        return;
      }
      createUserWithEmailAndPassword(auth, this.email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('user', user);
          const userData: User = {
            uid: user.uid,
            firstName: this.firstName,
            lastName: this.lastName || '',
            savedUsers: [],
            email: this.email,
            status: true
          }
          this.createUserInFirestore(userData);
          this.clearUserData();
          window.location.reload();
        })
        .catch((error: any) => {
          console.error('Registration failed: error.code', error.code);
          console.error('Registration failed: error.message', error.message);
        }); 
    }
  }


  checkPW(){
    if (this.password1 === this.password2) {
      this.samePw = true;
      return this.password1;
    } else {
      return '';
    }
  }


  clearUserData(){
    this.name = '';
    this.email = '';
    this.password1 = '';
    this.password2 = '';
  }


  getFirstAndLastName(){
    const fullname: string[] = this.name.split(' ');
    this.firstName = fullname[0];
    this.lastName = fullname[1];
    if (fullname[2]) {
      this.lastName += ' ' + fullname[2];
    }
  }


  async createUserInFirestore(userData: User){
    const docRef = await addDoc(this.getUserCollection(), userData);
    this.currentUser = docRef.id;
    this.getUserIdInLocalStorage(this.currentUser);
    this.route.navigateByUrl('/mainPage');
  }


  getUserCollection(){
    return collection(this.firestore, 'users');
  }


  async getUserIdInLocalStorage(userId: string) {
    const currentUserFromStorage = localStorage.getItem('currentUser');
    if (!currentUserFromStorage) {
      localStorage.setItem('currentUser', JSON.stringify(userId));
      await this.updateUserOnlineStatus(userId);
    }
  }
  


  async updateUserOnlineStatus(userId: string) {
    const userDocRef = doc(this.firestore, 'users', userId);
    const updates = {
      status: true,
    };
    await updateDoc(userDocRef, updates)
      .then(() => {
        console.error();
      })
      .catch((error) => {
        console.error(error);
      });
  }

//--------------- login -------------------------------------------------
  login() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.email, this.passwordLogin)
      .then((userCredential) => {
        const user = userCredential.user;
        const usersCollection = collection(this.firestore, 'users');
        const querySnapshot = query(usersCollection, where('uid', '==', user.uid));

        getDocs(querySnapshot)
          .then((snapshot) => this.userDocument(snapshot))
          .catch((error) => {
            console.error('Fehler beim Abrufen des Benutzerdokuments:', error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        this.switchCase(errorCode);
      });
  }

  userDocument(snapshot: QuerySnapshot) {
    if (snapshot.docs.length > 0) {
      const userDoc = snapshot.docs[0];
      this.currentUser = userDoc.id;
      this.getUserIdInLocalStorage(this.currentUser);
      this.route.navigateByUrl('/mainPage');
      // this.route.navigate([`/mainPage`]);
      setTimeout(() => {
        this.clearUserData();
        this.startAutoLogoutTimer();
      }, 1500);
    } else {
      console.error('Kein zugehöriges Benutzerdokument gefunden.');
    }
  }

  switchCase(errorCode: string) {
    switch (errorCode) {
      case 'auth/invalid-credential':
        this.errorMessage =
          '*Invalid credentials. Please check your entries.';
        break;
      case 'auth/too-many-requests':
        this.errorMessage =
          '*Access to this account has been temporarily disabled due to numerous failed login attempts.';
        break;
      default:
        this.errorMessage = '*Please check your entries.';
        break;
    }
  }
//--------------- guestLogin -------------------------------------------------
  guestLogin(){
    const auth = getAuth();
    const email = 'guest@gues.de';
    const password = 'guest@gues.de';
    const userId = '3oUdmL26NdAWAcYgYxQu';

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        this.getUserIdInLocalStorage(userId);
        setTimeout(() => {
          this.clearUserData();
        }, 1500);
        this.route.navigateByUrl('/mainPage');
      })
      .catch((error) => {
        console.error(error);
        this.errorMessage =
          'Fehler bei der Gastanmeldung. Bitte versuchen Sie es später erneut.';
      });
  }
  
//--------------- logout -------------------------------------------------
  logout(){
    const auth = getAuth();
    const userId = this.getCurrentUserId();

    if (userId) {
      const userDocRef = doc(this.firestore, `users/${userId}`);
      updateDoc(userDocRef, { status: false })
        .then(() => {
          signOut(auth)
            .then(() => {
              this.deleteUserIdInLocalStorage();
              this.route.navigate(['/login']);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error('Keine UserID gefunden');
    }
  }

  getCurrentUserId() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser !== null) {
      return JSON.parse(currentUser);
    }
  }

  deleteUserIdInLocalStorage() {
    localStorage.removeItem('currentUser');
  }

//--------------- google login -------------------------------------------------
  googleLogin() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
  
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const usersCollection = collection(this.firestore, 'users');
        const querySnapshot = query(
          usersCollection,
          where('uid', '==', user.uid)
        );
        getDocs(querySnapshot).then((snapshot) => {
          if (snapshot.empty) {
            this.createUserInFirestore({
              uid: user.uid,
              email: user.email || 'leer@gmail.com',
              firstName: user.displayName
                ? user.displayName.split(' ')[0]
                : 'FirstName',
              lastName: user.displayName
                ? user.displayName.split(' ').slice(1).join(' ')
                : 'LastName',
              status: true,
              savedUsers: [],
              color: '',
            });
          } else {
            this.ifExistUser(snapshot);
          }
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  /**
   * Processes existing user data after successful Google login.
   * @param {QuerySnapshot} snapshot - Firestore snapshot containing the user's data.
   */
  ifExistUser(snapshot: QuerySnapshot) {
    this.currentUser = snapshot.docs[0].id;
    this.getUserIdInLocalStorage(this.currentUser);
  }
}

