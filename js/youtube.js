function uploadVideo(file) {
  var metadata = createResource({'snippet.categoryId': '22',
                 'snippet.defaultLanguage': '',
                 'snippet.description': '',
                 'snippet.tags[]': '',
                 'snippet.title': 'blindary',
                 'status.embeddable': '',
                 'status.license': '',
                 'status.privacyStatus': 'unlisted',
                 'status.publicStatsViewable': ''
  });
    var token = getAccessToken();
    if (!token) {
      alert("You need to authorize the request to proceed.");
      return;
    }

    // if (!selectedFile) {
    //   alert("You need to select a file to proceed.");
    //   return;
    // }
    var params = {'part': 'snippet,status'};

    var uploader = new MediaUploader({
        baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
        file: file,
        token: token,
        metadata: metadata,
        params: params,
        onError: function(data) {
          var message = data;
          try {
            var errorResponse = JSON.parse(data);
            message = errorResponse.error.message;
          } finally {
            alert(message);
          }
        }.bind(this),
        onProgress: function(data) {
          var currentTime = Date.now();
          console.log('Progress: ' + data.loaded + ' bytes loaded out of ' + data.total);

          var progress = 60 + ( (data.loaded * 30) / data.total );
          $('#app-progress')[0].style['width'] = progress + '%';

          var totalBytes = data.total;
        }.bind(this),
        onComplete: function(data) {
          var uploadResponse = JSON.parse(data);
          console.log('Upload complete for video ' + data);
          $('#app-progress')[0].style['width'] = '100%';

          addVideoToPlaylist(uploadResponse.id);

        }.bind(this)
    });

    uploader.upload();
}

function deleteVideoFromPlaylist(playlist_link, video_link, length) {

  params = removeEmptyParams({
    'maxResults': length,
    'part': 'snippet,contentDetails',
    'playlistId': playlist_link
  });

  var request = gapi.client.request({
      'method': 'GET',
      'path': '/youtube/v3/playlistItems',
      'params': params
  });

  request.execute(function(response) {
    console.log(response);
    if(id = isHasVideo(video_link, response)) {

      buildApiRequest('DELETE',
                    '/youtube/v3/playlistItems',
                    {'id': id,
                     'onBehalfOfContentOwner': ''});

    }

  });

}

function isHasVideo(video_link, resp) {

  for(i = 0; i < resp.items.length; i++) {
    if(compareVideo(video_link, resp.items[i].contentDetails['videoId'])) {
      return resp.items[i].id;
    }
  }

}

function compareVideo(video_link, videoId) {

  return video_link == videoId;

}

function createPlaylist(type_id, id1, id2, id3) {
  var request = gapi.client.youtube.playlists.insert({
    part: 'snippet,status',
    resource: {
      snippet: {
        title: (Math.random() + 1).toString(36).substr(2, 12),
        description: ''
      },
      status: {
        privacyStatus: 'unlisted'
      }
    }
  });
  request.execute(function(response) {
    var result = response.result;
    if (result) {
      playlist_link = result.id;
      console.log('playlist id ' + playlist_link);

      if(type_id == 1) insertChapter(id1, id2, id3, playlist_link);
      else if(type_id == 2) confirmJoin(id1, playlist_link);
    

      // $('#playlist-id').val(playlistId);
      // $('#playlist-title').html(result.snippet.title);
      // $('#playlist-description').html(result.snippet.description);
    } else {
      // $('#status').html('Could not create playlist');
      console.log('Could not create playlist');
      popupWindow("https://youtube.com/create_channel?chromeless=1&next=/channel_creation_done", "", 560, 420);
    }
  });
}

function insertChapter(volunteer_id, book_id, chapter_id, playlist_link) {

  chapter = JSON.stringify({
    volunteer_id : volunteer_id,
    book_id : book_id,
    chapter_id : chapter_id,
    playlist_link : playlist_link
  });

  console.log(chapter);

  $.ajax({
    url : 'php/functions.php?function=ignoreJoin&param='+ chapter,
    success : function(data){
      location.reload();
    }
  });

}

function confirmJoin(join_id, playlist_link) {

  join = JSON.stringify({
    join_id : join_id,
    playlist_link : playlist_link
  });

  console.log('join');

  $.ajax({
    url : 'php/functions.php?function=confirmJoin&param=' + join,
    success : function(book_id) {
      window.location = "https://blindaryproduction.tk/createChapter?book_id=" + book_id;
    }
  });

}

function createResource(properties) {
    var resource = {};
    var normalizedProps = properties;
    for (var p in properties) {
      var value = properties[p];
      if (p && p.substr(-2, 2) == '[]') {
        var adjustedName = p.replace('[]', '');
        if (value) {
          normalizedProps[adjustedName] = value.split(',');
        }
        delete normalizedProps[p];
      }
    }
    for (var p in normalizedProps) {
      // Leave properties that don't have values out of inserted resource.
      if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
        var propArray = p.split('.');
        var ref = resource;
        for (var pa = 0; pa < propArray.length; pa++) {
          var key = propArray[pa];
          if (pa == propArray.length - 1) {
            ref[key] = normalizedProps[p];
          } else {
            ref = ref[key] = ref[key] || {};
          }
        }
      };
    }
    return resource;
  }

  function removeEmptyParams(params) {
    for (var p in params) {
      if (!params[p] || params[p] == 'undefined') {
        delete params[p];
      }
    }
    return params;
  }

  function executeRequest(request) {
    request.execute(function(response) {
      // console.log(response);
      // return response;
    });
  }

  function buildApiRequest(requestMethod, path, params, properties) {
    params = removeEmptyParams(params);
    var request;
    if (properties) {
      var resource = createResource(properties);
      request = gapi.client.request({
          'body': resource,
          'method': requestMethod,
          'path': path,
          'params': params
      });
    } else {
      request = gapi.client.request({
          'method': requestMethod,
          'path': path,
          'params': params
      });
    }
    executeRequest(request);
  }

/**
   * Retrieve the access token for the currently authorized user.
   */
  function getAccessToken(event) {
    return GoogleAuth.currentUser.get().getAuthResponse(true).access_token;
  }

  /**
   * Helper for implementing retries with backoff. Initial retry
   * delay is 1 second, increasing by 2x (+jitter) for subsequent retries
   *
   * @constructor
   */
  var RetryHandler = function() {
    this.interval = 1000; // Start at one second
    this.maxInterval = 60 * 1000; // Don't wait longer than a minute 
  };

  /**
   * Invoke the function after waiting
   *
   * @param {function} fn Function to invoke
   */
  RetryHandler.prototype.retry = function(fn) {
    setTimeout(fn, this.interval);
    this.interval = this.nextInterval_();
  };

  /**
   * Reset the counter (e.g. after successful request.)
   */
  RetryHandler.prototype.reset = function() {
    this.interval = 1000;
  };

  /**
   * Calculate the next wait time.
   * @return {number} Next wait interval, in milliseconds
   *
   * @private
   */
  RetryHandler.prototype.nextInterval_ = function() {
    var interval = this.interval * 2 + this.getRandomInt_(0, 1000);
    return Math.min(interval, this.maxInterval);
  };

  /**
   * Get a random int in the range of min to max. Used to add jitter to wait times.
   *
   * @param {number} min Lower bounds
   * @param {number} max Upper bounds
   * @private
   */
  RetryHandler.prototype.getRandomInt_ = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  /**
   * Helper class for resumable uploads using XHR/CORS. Can upload any
   * Blob-like item, whether files or in-memory constructs.
   *
   * @example
   * var content = new Blob(["Hello world"], {"type": "text/plain"});
   * var uploader = new MediaUploader({
   *   file: content,
   *   token: accessToken,
   *   onComplete: function(data) { ... }
   *   onError: function(data) { ... }
   * });
   * uploader.upload();
   *
   * @constructor
   * @param {object} options Hash of options
   * @param {string} options.token Access token
   * @param {blob} options.file Blob-like item to upload
   * @param {string} [options.fileId] ID of file if replacing
   * @param {object} [options.params] Additional query parameters
   * @param {string} [options.contentType] Content-type, if overriding the
   *    type of the blob.
   * @param {object} [options.metadata] File metadata
   * @param {function} [options.onComplete] Callback for when upload is complete
   * @param {function} [options.onProgress] Callback for status of in-progress
   *    upload
   * @param {function} [options.onError] Callback if upload fails
   */
  var MediaUploader = function(options) {
    var noop = function() {};
    this.file = options.file;
    this.contentType = options.contentType || this.file.type || 'application/octet-stream';
    this.metadata = options.metadata || {
      'title': this.file.name,
      'mimeType': this.contentType
    };
    this.token = options.token;
    this.onComplete = options.onComplete || noop;
    this.onProgress = options.onProgress || noop;
    this.onError = options.onError || noop;
    this.offset = options.offset || 0;
    this.chunkSize = options.chunkSize || 0;
    this.retryHandler = new RetryHandler();

    this.url = options.url;
    if (!this.url) {
      var params = options.params || {};
      params.uploadType = 'resumable';
      this.url = this.buildUrl_(options.fileId, params, options.baseUrl);
    }
    this.httpMethod = options.fileId ? 'PUT' : 'POST';
  };

  /**
   * Initiate the upload.
   */
  MediaUploader.prototype.upload = function() {
    var self = this;
    var xhr = new XMLHttpRequest();

    xhr.open(this.httpMethod, this.url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Upload-Content-Length', this.file.size);
    xhr.setRequestHeader('X-Upload-Content-Type', this.contentType);

    xhr.onload = function(e) {
      if (e.target.status < 400) {
        var location = e.target.getResponseHeader('Location');
        this.url = location;
        this.sendFile_();
      } else {
        this.onUploadError_(e);
      }
    }.bind(this);
    xhr.onerror = this.onUploadError_.bind(this);
    xhr.send(JSON.stringify(this.metadata));
  };

  /**
   * Send the actual file content.
   *
   * @private
   */
  MediaUploader.prototype.sendFile_ = function() {
    var content = this.file;
    var end = this.file.size;

    if (this.offset || this.chunkSize) {
      // Only slice the file if we're either resuming or uploading in chunks
      if (this.chunkSize) {
        end = Math.min(this.offset + this.chunkSize, this.file.size);
      }
      content = content.slice(this.offset, end);
    }

    var xhr = new XMLHttpRequest();
    xhr.open('PUT', this.url, true);
    xhr.setRequestHeader('Content-Type', this.contentType);
    xhr.setRequestHeader('Content-Range', 'bytes ' + this.offset + '-' + (end - 1) + '/' + this.file.size);
    xhr.setRequestHeader('X-Upload-Content-Type', this.file.type);
    if (xhr.upload) {
      xhr.upload.addEventListener('progress', this.onProgress);
    }
    xhr.onload = this.onContentUploadSuccess_.bind(this);
    xhr.onerror = this.onContentUploadError_.bind(this);
    xhr.send(content);
  };

  /**
   * Query for the state of the file for resumption.
   *
   * @private
   */
  MediaUploader.prototype.resume_ = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', this.url, true);
    xhr.setRequestHeader('Content-Range', 'bytes */' + this.file.size);
    xhr.setRequestHeader('X-Upload-Content-Type', this.file.type);
    if (xhr.upload) {
      xhr.upload.addEventListener('progress', this.onProgress);
    }
    xhr.onload = this.onContentUploadSuccess_.bind(this);
    xhr.onerror = this.onContentUploadError_.bind(this);
    xhr.send();
  };

  /**
   * Extract the last saved range if available in the request.
   *
   * @param {XMLHttpRequest} xhr Request object
   */
  MediaUploader.prototype.extractRange_ = function(xhr) {
    var range = xhr.getResponseHeader('Range');
    if (range) {
      this.offset = parseInt(range.match(/\d+/g).pop(), 10) + 1;
    }
  };

  /**
   * Handle successful responses for uploads. Depending on the context,
   * may continue with uploading the next chunk of the file or, if complete,
   * invokes the caller's callback.
   *
   * @private
   * @param {object} e XHR event
   */
  MediaUploader.prototype.onContentUploadSuccess_ = function(e) {
    if (e.target.status == 200 || e.target.status == 201) {
      this.onComplete(e.target.response);
    } else if (e.target.status == 308) {
      this.extractRange_(e.target);
      this.retryHandler.reset();
      this.sendFile_();
    }
  };

  /**
   * Handles errors for uploads. Either retries or aborts depending
   * on the error.
   *
   * @private
   * @param {object} e XHR event
   */
  MediaUploader.prototype.onContentUploadError_ = function(e) {
    if (e.target.status && e.target.status < 500) {
      this.onError(e.target.response);
    } else {
      this.retryHandler.retry(this.resume_.bind(this));
    }
  };

  /**
   * Handles errors for the initial request.
   *
   * @private
   * @param {object} e XHR event
   */
  MediaUploader.prototype.onUploadError_ = function(e) {
    this.onError(e.target.response); // TODO - Retries for initial upload
  };

  /**
   * Construct a query string from a hash/object
   *
   * @private
   * @param {object} [params] Key/value pairs for query string
   * @return {string} query string
   */
  MediaUploader.prototype.buildQuery_ = function(params) {
    params = params || {};
    return Object.keys(params).map(function(key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
  };

  /**
   * Build the upload URL
   *
   * @private
   * @param {string} [id] File ID if replacing
   * @param {object} [params] Query parameters
   * @return {string} URL
   */
  MediaUploader.prototype.buildUrl_ = function(id, params, baseUrl) {
    var url = baseUrl;
    if (id) {
      url += id;
    }
    var query = this.buildQuery_(params);
    if (query) {
      url += '?' + query;
    }
    return url;
  };
  /***** END BOILERPLATE CODE *****/