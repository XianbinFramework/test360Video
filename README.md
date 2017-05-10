# test360Video

A sinple test for 360 video using threejs(Typescript) and WebGL.

## Quick start

> Clone this project to your PC.

> Put a 360 video with name 3000.mp4 in Resources directory

**If you use safari**

> Double click on index.html

**If you use Chrome**

> Copy the project to your server and open it in Chrome with http://[yourserver]/[project]/index.html

or

> Setup un http server on your PC(for example using MAMP) and open it with http:// [localhost]/[project]/index.html

## Control video

- Move mouse in video view to change the position in video

- Tap and move mouse in video to scale video

## Project structure

##### index.html  
html file


##### mainApp.ts  
Main application.
Change video resource at this line :
> this.video.src = "Resources/3000.mp4";

Also video rendering size, texture size , camera position declare here.

##### VideoRender.ts

Main class to render video, webgl shader is created here.
** no use any more**


## TODO
- Scale smoothly and correctly. Maybe use mouse-wheel to control.

- Move smoothly and correctly.

- Do more test.
