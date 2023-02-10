# Sandclock


## Idea
- Simulate a little eco system with plants and animals
- Day and night cycle with sun and moon based on real time
- Plants grow and die
- Animals eat plants, reproduce, eat other animals, die
- Weather with rain, wind, snow, thunder, lightning and fog based on real world data

## Setup

### Update Raspbian
> ```bash
> sudo apt-get update
> sudo apt-get upgrade
> sudo apt-get dist-upgrade
> sudo apt-get autoremove
> sudo apt-get autoclean
> ```

### Install Display

> #### Install packages
> ```bash
> sudo apt-get install xserver-xorg-input-evdev
> ```

> #### Configure Display
> `sudo nano /boot/config.txt`
> ```bash
> #LCD Display HDMI Touchscreen Waveshare 7.9inch 400x1280
> dtparam=i2c_arm=on
> dtparam=spi=on
> enable_uart=1
> hdmi_group=2
> hdmi_mode=1
> hdmi_mode=87
> hdmi_cvt 400 1280 60 6 0 0 0
> dtoverlay=ads7846,cs=1,penirq=25,penirq_pull=2,speed=50000,keep_vref_on=0,swapxy=0,pmax=255,xohms=150,xmin=200,xmax=3900,ymin=200,ymax=3900
> ```

> #### Configure Touchscreen
> `sudo nano /usr/share/X11/xorg.conf.d/99-calibration.conf`
> ```bash
> Section "InputClass"
>   Identifier "calibration"
>   MatchProduct "ADS7846 Touchscreen"
>   Option "Calibration" "59 3985 3882 172"
>   Option "SwapAxes" "1"
>   Driver "evdev"
> EndSection
> ```

### Install Chromium

> #### Install packages
> ```bash
> sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox
> sudo apt-get install --no-install-recommends chromium-browser
> ```

> #### Configure Chromium
> `sudo nano /etc/xdg/openbox/autostart`
> ```bash
> xset s off
> xser s noblank
> xset -dpms
>
> setxkbmap -option terminate:ctrl_alt_bksp
>
> sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/'Local State'
> sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences
>
> chromium-browser --noerrdialogs  --disable-session-crashed-bubble --incognito --disable-infobars --kiosk 'https://ralphschuler.github.io/sandclock/'
> ```

 ### Setup Autostart
> `nano .bash_profile`
> ```bash
> [[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx
> ```