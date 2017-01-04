var idreply = 'reply' + data[0].fields.pk;
var dynamic1 = document.querySelector('.dynamic1');
var span = document.createElement('SPAN');
span.classList.add('tooltip');
span.id = idreply;
span.innerHTML = data[0].fields.comments_text;
dynamic1.appendChild(span);