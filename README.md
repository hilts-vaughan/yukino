# yukino
Yukino is a music search crawler that is capable of downloading, identifying (with Gracenote) and serving up music from various web services. It excels at making music accessible to all,  using just Youtube and SoundCloud.

# Setup

1. You should put your YouTube key inside of the `development.json` and override the default blank key if you have one.
This will allow you to make more requests than usaully allowed under the youTube API, important for high scalability.
If you do not need this, then you can forgo this key.
