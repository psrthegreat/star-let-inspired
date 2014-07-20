function hide(elem) {
	$(elem).removeClass('visible');
	$(elem).addClass('hidden');
}

function show(elem) {
	$(elem).removeClass('hidden');
	$(elem).addClass('visible');
}


$("#nameEnter").on("click", function(event) {
	show('.later');
	show('#passwordPrompt');
	hide('.first');
	hide('#emailPrompt');
});

$('#signup').on("click", function(event) {
	$('#signupForm').submit();
});