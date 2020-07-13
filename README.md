# Save Our Soul (SOS)
## [View on DevPost](https://devpost.com/software/save-our-soul-quo1pn)
*Save our Soul* is a anyonymous P2P video and chat Web Application developed to help such people. It allows users to anonymously connect with other users, tell them their stories, easier their burden by sharing with them. The application allows users to chat with other users or share their stories via video call. It features advanced reporting and is primarily based on linking such helpers and help seekers together regarding life issues in these tough times of quarantine.
 
- [COVID-19 Global Hackathon - Social & Mental Health](https://covid-global-hackathon-2.devpost.com/)
- [Quarantine Hacks 2020](https://qurantinehacks-2020.devpost.com/)

[![DEMO](https://lh3.googleusercontent.com/proxy/7lmjs7o5DfOlep9XZ3ljYVFQUI5WmSQxLUWdrG1Ack3RrWRt0mAvRUl9jj-G8LCgUhwf310r5AQdsGQPZMiLunCbGm6PVQSBrJnOopO3YXFplwrn8ZrcrHdwP1dAy6qtrmoT_v5SrJVmG2ili318orswVQ_ByZgpdg)](https://youtu.be/ANOH_n2g5HA)

## Inspiration
Since the start of coronavirus, many people have been facing greater mental stress. This could be due to the untimely loss of a loved one to corona, being away from home, being unable to meet friends and family - the people that keep you positive or because of some other deep issues.  There are issues that at times you are unable to share with your closest friends or family members. Therefore, we wanted to create an application that did not only allow us to connect to the people we regularly talk to but also to others whom we have never met. It helps create a safe space where people can talk to each other, discuss their problems, and look for advice. It's like a free therapy session!

![Landing](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/001/151/593/datas/gallery.jpg)
![ChatVid](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/001/151/591/datas/gallery.jpg)

## Instructions
- The first command builds the client React app after installing client dependencies and moves the build folder to the root directory:
```
cd app && npm i && npm run build && mv build .. && cd ..
```
- Next just install server dependencies start the NodeJS server in the root directory using
```
npm install
npm start
```

## Themes
- *How do we connect people in unique ways to prevent loneliness* when isolation is their only option?
- *How do we help people engage with each other in safe ways* when social distancing is not an option?

## Features
- Focused landing page for help seekers and helpers
- Join by category/issue with algorithmic matching to prioritize among these categories
- Realtime video stream and chat system while maintaing anonymity
- Skip/Next user
- Report a user, NSFW detection

## Technology
- ReactJS
- HTML
- CSS
- WebRTC
- Socket.IO
- NodeJS
- [Heroku](https://save-our-soul.herokuapp.com/)
- [DeepAI Content Moderation / NSFW Image Detection API](https://deepai.org/machine-learning-model/content-moderation)
