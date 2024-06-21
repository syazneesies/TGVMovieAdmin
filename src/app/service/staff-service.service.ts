import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StaffServiceService {
  private baseUrl = 'https://api.tgv.syaznee.com';

  constructor(private http: HttpClient) {}

  getUserById(id:string){
    return this.http.get<any[]>(this.baseUrl + '/profile/'+id);
  }

  addStaff(staffData: any) {
    return this.http.post<any>(this.baseUrl+ '/addStaff', staffData);
    //console.log(staffData);
  }

  getStaff(){
    return this.http.get<any[]>(this.baseUrl + '/staff');
  }

  deleteStaff(id:number){
    return this.http.delete<any>(this.baseUrl+'/deleteStaff/'+id);
  }

  getStaffById(id:string){
    return this.http.get<any[]>(this.baseUrl + '/staff/'+id);
  }

  updateStaff(staff:any){
    return this.http.put<any>(this.baseUrl+'/updateStaff/'+staff.user_id, staff);
  }

}
