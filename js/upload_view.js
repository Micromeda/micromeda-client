/**
 * upload_view.js
 * Description: code that implements upload view page functionality
 */

const back_end_url = 'http://0.0.0.0:5000/';

// Creates dropzone
function create_dropzone() {
    $('.dropzone').removeClass('hidden');

    new Dropzone('.dropzone',
        {
            url: back_end_url + 'upload',
            clickable: true,
            createImageThumbnails: false,
            maxFilesize: 2000,
            withCredentials: true,
            previewsContainer: ".dropzone-previews",
            addedfile: function (file_data) {
                var progress_container = $('<div class="progress progress-striped"></div>');
                var progress_bar = $('<div class="progress-bar progress-bar-info active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>');
                var upload_id = this.files.length - 1;

                this.options.url = back_end_url + 'upload';
                file_data.progress_bar = progress_bar[0];
                progress_bar.attr('id', 'upload' + upload_id).css('width', '0%');
                progress_container.append(progress_bar);
                $('#progress_bars').append(progress_container);
                $('#proj_id').attr('disabled', true)
            },
            uploadprogress: function (file_data, progress) {
                var decimal_places = 1;
                var formatted_progress = progress.toFixed(decimal_places);

                $(file_data.progress_bar).css('width', formatted_progress + '%').attr('aria-valuenow', formatted_progress).text(formatted_progress + '%');
            },
            success: function (file_data) {
                $(file_data.progress_bar).removeClass('progress-bar-info').addClass('progress-bar-success').removeClass('active').css('width', '100%').attr('aria-valuenow', 100).text('100%');

                // Skip redirection if files are still uploading
                for (var index in this.files) {
                    if (this.files[index].status === 'uploading') {
                        return;
                    }
                }

                // Redirect once all files have been uploaded
                setTimeout(function(){
                    window.location.assign('../index.html');
                }, 1000);
            },
            error: function (file_data, response) {
                $(file_data.progress_bar).removeClass('progress-bar-info').addClass('progress-bar-success').removeClass('active').css('width', '100%').attr('aria-valuenow', 100).text('100%');

                var progress_bar = $(file_data.progress_bar);
                progress_bar.removeClass('active').text('Error').removeClass('progress-bar-info').addClass('progress-bar-danger');
                $(file_data.progress_bar).css('width', '100%').attr('aria-valuenow', '100').text('Error');

                if (!file_data.accepted) {
                    console.error('Upload rejected: invalid file type (FASTQ files only)');
                }
                else if (file_data.xhr.status === 401) {
                    console.error('You must be logged in to upload files');
                }
                else if (file_data.xhr.status === 0) {
                        console.error('Failed to connect to server')
                    }
                    else {
                        console.error('File upload failed: ' + response.error);
                    }
            }
        });
}

$(document).ready(function () {
    Dropzone.autoDiscover = false;
    create_dropzone();
});
