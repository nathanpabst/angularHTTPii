import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from './post.model';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostsService {
    error = new Subject<string>();

    constructor(private http: HttpClient) { }

    createAndStorePost(title: string, content: string) {
        const postData: Post = { title, content };
        this.http
            .post<{ name: string }>(
                'https://angularhttpii.firebaseio.com/posts.json',
                postData
            )
            .subscribe(responseData => {
                console.log(responseData);
            }, error => {
                this.error.next(error.message);
            });
    }

    // adding a custom header. to test...clear network tab, fetch posts, check the Headers section in the console for the request
    fetchPosts() {
        return this.http
            .get<{ [key: string]: Post }>('https://angularhttpii.firebaseio.com/posts.json',
                {
                    headers: new HttpHeaders({ 'Custom-header': 'Hello' })
                }
            )
            .pipe(
                map(responseData => {
                    const postsArray: Post[] = [];
                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            postsArray.push({ ...responseData[key], id: key });
                        }
                    }
                    return postsArray;
                }),
                catchError(errorRes => {
                    // send to analytics server...
                    return throwError(errorRes);
                })
            );
    }

    clearAllPosts() {
        return this.http
            .delete<{}>('https://angularhttpii.firebaseio.com/posts.json');
    }

}
