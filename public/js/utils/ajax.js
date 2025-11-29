(function() {
    var ajax = {
        get: function(url, parameters, defaultValue) {
            return new Promise(function(resolve, reject) {
                var result = defaultValue;
                parameters = parameters || {};
                url += '?';
                for (var key in parameters) {
                    var parameter = parameters[key];
                    url += key + '=' + encodeURIComponent(parameter) + '&';
                }
                $.ajax({
                    type: 'GET',
                    url: url
                })
                .then(function(data) {
                    result = data;
                })
                .fail(function(response) {
                    const { message, title } = response.responseJSON;
                    toastr.error(message, title || 'An error occurred', {timeOut: 5000});
                })
                .always(function(data) {
                    resolve(result);
                });
            });
        },
        remove: function(url) {
            return new Promise(function(resolve, reject) {
                var result = null;
                $.ajax({
                    type: 'DELETE',
                    url
                })
                .then(function(data) {
                    result = data;
                })
                .fail(function(response) {
                    const { message, title } = response.responseJSON;
                    toastr.error(message, title || 'An error occurred', {timeOut: 5000});
                })
                .always(function(data) {
                    resolve(result);
                });
            });
        },
        save: function(url, entity) {
            return new Promise(function(resolve, reject) {
                var result = null;
                var request = {
                    type: 'POST',
                    url,
                    contentType: 'application/json',
                    data: JSON.stringify(entity)
                };

                if (entity.Id !== 0) {
                    request.type = 'PUT';
                }

                $.ajax(request)
                .then(function(data) {
                    result = data;
                })
                .fail(function(response) {
                    const { message, title } = response.responseJSON;
                    toastr.error(message, title || 'An error occurred', {timeOut: 5000});
                })
                .always(function(data) {
                    resolve(result);
                });
            });
        }
    };
    window.Ajax = ajax;
})();