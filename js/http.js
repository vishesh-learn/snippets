let options = {
    method: 'POST',
    headers: {
        'Authorization': 'Basic ' + btoa(`${USERNAME}:${PASSWORD}`),
        'Content-Type': 'application/json',
        'body': JSON.stringify(body)
    }
}

fetch(API_URL, options)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        
        if (res.headers.get('content-type').includes('application/json')) {
            return res.json();
        } else {
            return res.text();
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        
        return false;
    });