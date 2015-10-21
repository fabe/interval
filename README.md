# interval

This is a project for a class at the [University of Applied Sciences Potsdam](http://interface.fh-potsdam.de/showcase/). The goal was to create an IoT-Device, preferably with NodeJS and Johnny Five. The two-week long class was supervised by [Fabian Morón Zirfas](https://github.com/fabiantheblind).

*Interval* is a sleep tracker that grabs values from an accelerometer (in this case the MPU6050) and visualizes movement throughout the night. Tracking can be started and ended via a website that runs on NodeJS, which is also the place where the visualization happens.

## Hardware
For this project, I’ve used a [Raspberry Pi A+](https://www.raspberrypi.org/products/model-a-plus/) hooked up with an [Edimax WiFi USB Adapter](http://amzn.com/B003MTTJOY). The accelerometer in use is the [MPU-6050](http://amzn.com/B008BOPN40). See the [Fritzing Sketch for correct installation](http://i.imgur.com/hGOfs6k.jpg).

I attached the accelerometer to a wooden board for more accurate tracking and placed it next to my pillow. See the prototype below:

![](http://i.imgur.com/GIVh0hq.jpg)

The final product would be invisible and hidden underneath the sheets/bed.

## Software
NodeJS and MongoDB is running on the Raspberry Pi. I get the accelerometer data through the (specific) [mpu6050 module](https://github.com/jstapels/mpu6050/). For installation instructions I collected some [helpful links](#helpful-links) below.

I set up [forever](https://github.com/foreverjs/forever) on my Raspberry Pi so that my server is always up and running. Otherwise just use `npm start` to start. Make sure that the database is running (`sudo mongod start` or `sudo /etc/init.d/mongod start`).

Communication between frontend and backend happens either via AJAX (for data) or socket.io (for starting/ending tracking).

If you want to change the styling of the page please use [Compass](http://compass-style.org/) via the `comapass watch` command in the root of the project. The stylesheets can be found in the `/sass` directory. Output is in `/public/css`.

For templating [Jade](http://jade-lang.com/) is used, the views are located in `/views`.

Also, run `bower install` to get all frontend components (located in `/public/components`)!

## Screenshot
As stated before, tracking can be started and ended on the website. The visualization also happens there. The higher the values, the lighter is the sleep at that time. Low values indicate a deep sleep phase.
![](http://i.imgur.com/8URxoBU.png)
![](http://i.imgur.com/RbOPvCf.jpg)

## Concerns and Outlook
Unfortunately the visualization and tracking of the accelerometer data is not as accuate and unambiguous as I’ve hoped, so there is definitely some work to do.

I could imagine interesting addtions to the hardware, such as sensors for air quality, temperature, brightness, or even more accelerometers that are attached to the body. Autonomous starting and ending of the tracking could be a cool feature on the software side.

## Helpful Links
- [Install NodeJS on Raspberry Pi](https://www.bitpi.co/2015/02/12/install-nodejs-on-raspberry-pi/)
- [Installing mongodb on Raspberry Pi (using pre-compiled binaries)](http://www.widriksson.com/install-mongodb-raspberrypi/)
- [Raspberry Pi MongoDB Installation – The working guide!](http://c-mobberley.com/wordpress/2013/10/14/raspberry-pi-mongodb-installation-the-working-guide/)
- [Interfacing Raspberry Pi and MPU-6050](http://blog.bitify.co.uk/2013/11/interfacing-raspberry-pi-and-mpu-6050.html)
- [Reading data from the MPU-6050 on the Raspberry Pi](http://blog.bitify.co.uk/2013/11/reading-data-from-mpu-6050-on-raspberry.html)
- [General Information on Accelerometers](http://www.hobbytronics.co.uk/accelerometer-info)
- [MPU6050 module for node-i2c (fixed version)](https://github.com/miniben-90/mpu6050/commit/1c8d08444944367018d463c27217ca0159fa142d)
- [MPU6050 calculations from johnny-five](https://github.com/rwaldron/johnny-five/blob/06b5127d54ec2874910e8d505ed897bc339c9e58/lib/accelerometer.js)
- [How do I backup my Raspberry Pi?](http://raspberrypi.stackexchange.com/a/312)

## License
The MIT License (MIT)

Copyright (c) 2015 Fabian Schultz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.