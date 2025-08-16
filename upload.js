document.getElementById('uploadCraftForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form fields
    const title = document.getElementById('craftTitle');
    const description = document.getElementById('craftDescription');
    const fileInput = document.getElementById('craftFile');

    // Error messages
    let isValid = true;

    // Regular expression to ensure no numbers are allowed, only alphabetic characters and spaces
    const textOnlyRegex = /^[a-zA-Z\s.,'!?\-]+$/;

    // Title validation: should be at least 3 characters and contain only text (no numbers)
    if (title.value.length < 3 || title.value.length > 100) {
        document.getElementById('titleError').innerText = 'Title must be between 3 and 100 characters long.';
        isValid = false;
    } else if (!textOnlyRegex.test(title.value)) {
        document.getElementById('titleError').innerText = 'Title can only contain letters and spaces. Numbers are not allowed.';
        isValid = false;
    } else {
        document.getElementById('titleError').innerText = '';
    }

    // Description validation: should be at least 10 characters and contain only text (no numbers)
    if (description.value.length < 10 || description.value.length > 300) {
        document.getElementById('descError').innerText = 'Description must be between 10 and 300 characters long.';
        isValid = false;
    } else if (!textOnlyRegex.test(description.value)) {
        document.getElementById('descError').innerText = 'Description can only contain letters and spaces. Numbers are not allowed.';
        isValid = false;
    } else {
        document.getElementById('descError').innerText = '';
    }

    // File validation: ensure a file is selected and check the file type
    if (!fileInput.value) {
        document.getElementById('fileError').innerText = 'Please upload an image or video file.';
        isValid = false;
    } else {
        const file = fileInput.files[0];
        const validFileTypes = [
            'image/jpeg', // JPEG images
            'image/png', // PNG images
            'image/gif', // GIF images
            'image/webp', // WEBP images
            'video/mp4', // MP4 videos
            'video/ogg', // OGG videos
            'video/webm' // WEBM videos
        ];

        // Check the file type
        if (!validFileTypes.includes(file.type)) {
            document.getElementById('fileError').innerText = 'Invalid file type! Please upload an image or video (JPEG, PNG, GIF, WEBP, MP4, OGG, or WEBM).';
            isValid = false;
        } else {
            document.getElementById('fileError').innerText = '';
        }
    }

    // If form is valid, proceed with submission
    if (isValid) {
        const formData = new FormData(this); // Create a FormData object

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Craft uploaded successfully!');
                this.reset(); // Reset the form after successful upload
            } else {
                alert('Error uploading craft. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error uploading craft. Please check your network connection.');
        }
    }
});
