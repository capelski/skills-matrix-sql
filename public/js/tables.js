(function (js, navigation) {
  var htmlNodes = {
    loader: $('#tables-loader'),
    createTablesButton: $('#create-tables-button'),
    insertDataButton: $('#insert-data-button'),
    deleteDataButton: $('#delete-data-button'),
    dropTablesButton: $('#drop-tables-button'),
    viewWrapper: $('#tables-view-wrapper'),
  };

  function render(loading) {
    if (loading) {
      htmlNodes.loader.css({ display: 'block' });
      htmlNodes.viewWrapper.css({ display: 'none' });
    } else {
      htmlNodes.loader.css({ display: 'none' });
      htmlNodes.viewWrapper.css({ display: 'block' });
    }
  }

  function httpCall(url, successMessage) {
    render(true);
    const promise = $.ajax({ type: 'POST', url });
    js.stallPromise(promise, 1000)
      .then(function () {
        toastr.info(successMessage, { timeOut: 5000 });
      })
      .catch(function (response) {
        const { message, title } = response.responseJSON;
        toastr.error(message, title || 'An error occurred', { timeOut: 5000 });
      })
      .finally(() => {
        render(false);
      });
  }

  htmlNodes.createTablesButton.on('click', function () {
    httpCall('/api/tables/create', 'Tables created');
  });

  htmlNodes.insertDataButton.on('click', function () {
    httpCall('/api/tables/populate', 'Data created');
  });

  htmlNodes.deleteDataButton.on('click', function () {
    httpCall('/api/tables/delete', 'Data deleted');
  });

  htmlNodes.dropTablesButton.on('click', function () {
    httpCall('/api/tables/drop', 'Tables deleted');
  });

  navigation.register('tables-section', function () {});
})(window.JsCommons, window.Navigation);
