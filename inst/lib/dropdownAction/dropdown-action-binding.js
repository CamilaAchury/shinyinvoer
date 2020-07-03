let binding = new Shiny.InputBinding();

function dropdownActionCreateTriggerButton(label) {
  const button = document.createElement('button');
  button.classList.add('dropdown-action-trigger');
  button.textContent = label;
  button.innerHTML =
    button.innerHTML +
    '<svg class="dropdown-action-indicator" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.3 9.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z" /></svg>';
  return button;
}

function dropdownActionCreateActionList(choices, downloadable) {
  const dropdownActionList = document.createElement('div');
  dropdownActionList.classList.add('dropdown-action-list');

  const isdownloadable = downloadable == 'TRUE'

  if (isdownloadable) {
    choices.forEach(function (choice) {
      const dropdownActionItem = document.createElement('a');
      dropdownActionItem.setAttribute('id', choice.id);
      dropdownActionItem.setAttribute('target', '_blank');
      dropdownActionItem.classList.add('shiny-download-link', 'dropdown-action-item');
      dropdownActionItem.setAttribute('download', '');
      dropdownActionItem.dataset.action = choice.id;
       if (choice.image) {
        const dropdownActionItemImage = document.createElement('img');
        dropdownActionItemImage.classList.add('dropdown-action-item-image');
        dropdownActionItemImage.setAttribute('src', choice.image);
        dropdownActionItem.appendChild(dropdownActionItemImage);
      }
      const dropdownActionItemLabel = document.createElement('span');
      dropdownActionItemLabel.classList.add('dropdown-action-item-label');
      dropdownActionItemLabel.textContent = choice.label;
      dropdownActionItem.appendChild(dropdownActionItemLabel);
      dropdownActionList.appendChild(dropdownActionItem);
    });
  } else {
    choices.forEach(function (choice) {
      const dropdownActionItem = document.createElement('div');
      dropdownActionItem.setAttribute('title', choice.label);
      dropdownActionItem.classList.add('dropdown-action-item');
      dropdownActionItem.dataset.action = choice.id;
      if (choice.image) {
        const dropdownActionItemImage = document.createElement('img');
        dropdownActionItemImage.classList.add('dropdown-action-item-image');
        dropdownActionItemImage.setAttribute('src', choice.image);
        dropdownActionItem.appendChild(dropdownActionItemImage);
      }
      const dropdownActionItemLabel = document.createElement('span');
      dropdownActionItemLabel.classList.add('dropdown-action-item-label');
      dropdownActionItemLabel.textContent = choice.label;
      dropdownActionItem.appendChild(dropdownActionItemLabel);
      dropdownActionList.appendChild(dropdownActionItem);
    });
  }
  return dropdownActionList;
}

$.extend(binding, {
  find: function (scope) {
    return $(scope).find('.dropdown-action-container');
  },
  initialize: function (el) {
    console.log(el);
    const dropdownActionTrigger = dropdownActionCreateTriggerButton(
      el.dataset.label
    );
    const dropdownActionList = dropdownActionCreateActionList(
      JSON.parse(el.dataset.options), el.dataset.downloadable
    );
    el.appendChild(dropdownActionTrigger);
    el.appendChild(dropdownActionList);
  },
  getValue: function (el) {
    return el.dataset.selected;
  },
  subscribe: function (el, callback) {
    const dropdownActionIndicator = el.querySelector(
      '.dropdown-action-indicator'
    );
    const dropdownActionList = el.querySelector('.dropdown-action-list');

    function dropdownActionToggleClass(el, className) {
      el.classList.toggle(className, !el.classList.contains(className));
    }

    function dropdownActionToggleStates() {
      dropdownActionToggleClass(dropdownActionList, 'is-open');
      dropdownActionToggleClass(dropdownActionIndicator, 'is-open');
    }

    el.addEventListener('click', function (event) {
        const { target } = event;
        console.log(target)
        if (
          target.matches('.dropdown-action-trigger') ||
          target === dropdownActionIndicator
        ) {
          dropdownActionToggleStates();
          return callback();
        }

        if (target.matches('.dropdown-action-item') || target.matches('.dropdown-action-item .dropdown-action-item-image') || target.matches('.dropdown-action-item .dropdown-action-item-label')) {
        const action = target.dataset.action ? target.dataset.action : target.parentNode.dataset.action;
        el.dataset.selected = action || '';
        dropdownActionToggleStates();
        return callback();
      }
    });
  },
});

Shiny.inputBindings.register(binding);