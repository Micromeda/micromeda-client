/**
 * Created by: Lee Bergstrand (2018)
 * Edited by: Santiago Ruiz-Navas (2020)
 * Description: code to activate the upload zone.
  */

/**
 * upload_view.js
 * Description: code that implements upload view page functionality
 */


Dropzone.autoDiscover = false;
let back_end_url = "";

$(document).ready(function () {
    $.getJSON('../configs/application_configuration.json', function (config) {
        $.getJSON("../configs/diagram_configuration.json", function (diagram_parameters) {
            back_end_url = config['back_end_url'];
            localforage.config({name: 'micromeda', storeName: 'micromeda_data'});
            draw_top_navbar(diagram_parameters.topnavbar);
            draw_dropzone();
            draw_footer(diagram_parameters.footer);
            
            create_dropzone();
        });
    });
});

// Creates dropzone
function create_dropzone()
{
    $('.dropzone').removeClass('hidden');

    new Dropzone('.dropzone',
        {
            url: back_end_url + 'upload',
            clickable: true,
            createImageThumbnails: false,
            maxFilesize: 2000,
            timeout:60000,
            withCredentials: true,
            previewsContainer: ".dropzone-previews",
            addedfile: function (file_data) {
                let progress_container = $('<div class="progress progress-striped"></div>');
                let progress_bar = $(
                    '<div class="progress-bar progress-bar-info active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>');
                let upload_id = this.files.length - 1;

                this.options.url = back_end_url + 'upload';
                file_data.progress_bar = progress_bar[0];
                progress_bar.attr('id', 'upload' + upload_id).css('width', '0%');
                progress_container.append(progress_bar);
                $('#progress_bars').append(progress_container);
            },
            uploadprogress: function (file_data, progress) {
                let decimal_places = 1;
                let formatted_progress = progress.toFixed(decimal_places);

                $(file_data.progress_bar).css('width', formatted_progress + '%')
                                         .attr('aria-valuenow', formatted_progress)
                                         .text(formatted_progress + '%');
            },
            success: function (file_data, response) {
                $(file_data.progress_bar).removeClass('progress-bar-info').addClass('progress-bar-success')
                                         .removeClass('active').css('width', '100%').attr('aria-valuenow', 100)
                                         .text('100%');

                // Skip redirection if files are still uploading
                for (var index in this.files)
                {
                    if (this.files[index].status === 'uploading')
                    {
                        return;
                    }
                }

                // Redirect once all files have been uploaded
                setTimeout(function () {
                    let result_key = response.result_key;

                    localforage.setItem('micromeda-result-key', result_key).then(function () {
                        window.location.assign('../index.html');
                    }).catch(function (err) {
                        console.log(err);
                        window.location.assign('../index.html');
                    });
                }, 5000);
            },
            error: function (file_data, response) {
                console.log("file_data");
                console.log(file_data);
                $(file_data.progress_bar).removeClass('progress-bar-info').addClass('progress-bar-success')
                                         .removeClass('active').css('width', '100%').attr('aria-valuenow', 100)
                                         .text('100%');

                var progress_bar = $(file_data.progress_bar);
                progress_bar.removeClass('active').text('Error').removeClass('progress-bar-info')
                            .addClass('progress-bar-danger');
                $(file_data.progress_bar).css('width', '100%').attr('aria-valuenow', '100').text('Error');

                if (!file_data.accepted)
                {
                    console.error('Upload rejected: invalid file type (Micromeda files only)');
                }
                else
                {
                    if (file_data.xhr.status === 401)
                    {
                        console.error('You must be logged in to upload files');
                    }
                    else
                    {
                        if (file_data.xhr.status === 0)
                        {
                            console.error('Failed to connect to server or file too large increase the timeout');
                        }
                        else
                        {
                            console.error('File upload failed: ' + response.error);
                        }
                    }
                }
            }
        });
}



