import requests
from bs4 import BeautifulSoup

def getText(url):
    response = requests.get(url)

    if response.status_code == 200:
        html_content = response.text

        soup = BeautifulSoup(html_content, 'html.parser')

        page_text = soup.get_text()


        return page_text
    else:
        return response.status_code