from django.shortcuts import render
from django.http import HttpResponse
import requests
from bs4 import BeautifulSoup

def home(request):
    return render(request, 'main/home.html')

def result(request):
    return render(request, 'main/result.html')

def process_url(request):
    if request.method == "POST":
        url = request.POST.get('url')
        if not url:
            return HttpResponse("URL is required", status=400)


        try:
            response = requests.get(url)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                page_text = soup.get_text()

                response = HttpResponse(page_text, content_type='text/plain')
                response['Content-Disposition'] = 'attachment; filename="result.txt"'
                return response
            else:
                return HttpResponse(f"Failed to fetch URL, status code: {response.status_code}", status=400)
        except Exception as e:
            return HttpResponse(f"Error occurred: {str(e)}", status=500)
    return HttpResponse("Invalid request method", status=405)
