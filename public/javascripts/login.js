function hide(elem) {
	$(elem).removeClass('visible');
	$(elem).addClass('hidden');
}

function show(elem) {
	$(elem).removeClass('hidden');
	$(elem).addClass('visible');
}

$('#signup').on("click", function(event) {
	$('#signupForm').submit();
});