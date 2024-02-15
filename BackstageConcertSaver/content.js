chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "createICalFile") {
      createICalFile();
      sendResponse({status: "success"});
    }
    return true;
  });
  
function createICalFile() {
    const titleElement = document.querySelector('h1.page-title');
    const dateElement = document.querySelector(".product-info-essential .col-4");
    const startTimeElement = document.querySelector(".product-info-essential .col-3 .ticketshop-icon-clock-svg-white strong");
    const locationElement = document.querySelector(".product.attribute.eventlocation .value[itemprop='eventlocation']");

    if (!titleElement || !dateElement || !startTimeElement) {
        console.error('One or more elements could not be found.');
        return;
    }

    const eventLocation = locationElement.innerText.trim();

    const title = titleElement.innerText;
    let dateInfo = dateElement.innerText.trim().replace(/\s+/g, ' ');
    let startTime = startTimeElement.innerText.trim().replace(' Uhr', '');
    let dateTimeString = `${dateInfo} ${startTime}`;
    dateTimeString = convertGermanDateToISO(dateTimeString);

    if (!dateTimeString) {
        console.error('Invalid date format.');
        return;
    }

    const date = new Date(dateTimeString);

    if (isNaN(date)) {
        console.error('Invalid date value:', dateTimeString);
        return;
    }

    const eventUrl = window.location.href;
    const startDate = formatDateForICal(date);
    const endDate = formatDateForICal(new Date(date.getTime() + (3 * 60 * 60 * 1000)));

    const icalContent = 
        `BEGIN:VCALENDAR\n` +
        `VERSION:2.0\n` +
        `BEGIN:VEVENT\n` +
        `SUMMARY:${title}\n` +
        `DTSTART:${startDate}\n` +
        `DTEND:${endDate}\n` +
        `URL:${eventUrl}\n` +
        `LOCATION:${eventLocation}\n` +
        `END:VEVENT\n` +
        `END:VCALENDAR`;

    downloadICalFile(icalContent, title);
}

function formatDateForICal(date) {
    return date.toISOString().replace(/-|:|\.\d{3}/g, '');
}

function downloadICalFile(content, title) {
    const blob = new Blob([content], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function convertGermanDateToISO(dateTimeString) {

    const months = {
        'Januar': '01', 'Februar': '02', 'März': '03', 'April': '04', 'Mai': '05', 'Juni': '06',
        'Juli': '07', 'August': '08', 'September': '09', 'Oktober': '10', 'November': '11', 'Dezember': '12'
    };

    const parts = dateTimeString.match(/(\d+)\. (\w+) (\d+) (\d+):(\d+)/);
    if (!parts) return null;

    const year = parts[3];
    const month = months[parts[2]];
    const day = parts[1].padStart(2, '0');
    const hour = parts[4];
    const minute = parts[5];

    return `${year}-${month}-${day}T${hour}:${minute}`;
}