
# Audiopen.ai clone

This project implements the basic functionality of recording audio on frontend and uploads it to the server, transcribes using whisper library from openai and summarize it using openai api call.

## Setup

ffmpeg must be installed on your system for whisper ai to work. Install it by using following instructions

```
# on Ubuntu or Debian
sudo apt update && sudo apt install ffmpeg

# on Arch Linux
sudo pacman -S ffmpeg

# on MacOS using Homebrew (https://brew.sh/)
brew install ffmpeg

# on Windows using Chocolatey (https://chocolatey.org/)
choco install ffmpeg

# on Windows using Scoop (https://scoop.sh/)
scoop install ffmpeg
```

In project root create a virtual env, activate it and install required libraries
```
python3 -m venv venv 
source venv/bin/activate
pip3 install -r requirements.txt
```

Run migrations
```
python3 manage.py migrate
```

Create .env file from .env.example and add your OPENAI_API_KEY otherwise the app will not work.
```
# .env

OPENAI_API_KEY=YOUR_API_KEY
```

Run server
```
python3 manage.py runserver
```