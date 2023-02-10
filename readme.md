
## Resources
- [Raspberry Pi + Display Waveshare LCD HDMI Touch](https://www.opendisplaycase.com/tutorials-learn/raspberry-pi-display-waveshare-lcd-1024x600-hdmi-touch.html)

## Setup

### Install Display


### Install Chromium
```bash
sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox
sudo apt-get install --no-install-recommends chromium-browser
```

`sudo nano /etc/xdg/openbox/autostart`
```bash
xset s off
xser s noblank
xset -dpms

setxkbmap -option terminate:ctrl_alt_bksp

sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/'Local State'
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences

chromium-browser --noerrdialogs  --disable-session-crashed-bubble --incognito --disable-infobars --kiosk 'https://ralphschuler.github.io/sandclock/'
```

## Start
`nano .bash_profile`
```bash
[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx
```