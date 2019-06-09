import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { Post } from './post.model';
import { map, catchError, tap } from 'rxjs/operators';
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
                postData,
                {
                    observe: 'response' // returns the full response of the http call
                }
            )
            .subscribe(responseData => {
                console.log(responseData);
            }, error => {
                this.error.next(error.message);
            });
    }

    fetchPosts() {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty');
        searchParams = searchParams.append('custom', 'key');
        return this.http
            .get<{ [key: string]: Post }>('https://angularhttpii.firebaseio.com/posts.json',
                {
                    headers: new HttpHeaders({ 'Custom-header': 'Hello' }),
                    params: searchParams
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
            .delete<{}>('https://angularhttpii.firebaseio.com/posts.json',
                {
                    observe: 'events'
                }
            ).pipe(tap(event => {
                console.log(event);
                if (event.type === HttpEventType.Response) {
                    console.log('event body: ', event.body);
                }
            }));
    }

}
