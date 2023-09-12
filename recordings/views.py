from django.shortcuts import render, get_object_or_404
from dotenv import load_dotenv
from django.http.response import JsonResponse

from .models import Record

import os
import whisper
import openai

load_dotenv()

def home(request):
    return render(request,'index.html')



def file_upload(request):
    if request.method == "POST":
        try:
            audio_file = request.FILES.get("recorded_audio")
            record = Record.objects.create(voice_record=audio_file)
            record.save()
            transcript = transcribe(record.id)
            if transcribe != '':
                summary = summarize(transcript)
            return JsonResponse({
                'message': summary
            })
        except Exception as e:
            return JsonResponse({
                "message": e
            })
        
def transcribe(id):
    try:
        record = get_object_or_404(Record, id=id)
        model = whisper.load_model("base")
        result = model.transcribe(record.voice_record.path)
        return result["text"]
    except Exception as e:
        return ''

def summarize(transcript):
    prompt = """summarize the following text: {}""".format(transcript)
    openai.api_key = os.environ.get("OPENAI_API_KEY")
    summary =  openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0.6
    )
    return summary