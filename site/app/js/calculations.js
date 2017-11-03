			$(document).ready(function() {

				// Grab the current date
				var currentDate = new Date();
				
				// Set date in the past. First day of my working life!
				var pastDate = new Date(1995, 8, 4, 9);			

				var fixyear = Date.DatePart('m',pastDate) > Date.DatePart('m',currentDate);
				
				var years = Date.DateDiff('yyyy', pastDate, currentDate);
				if (fixyear)
				{
					years--;
				}	
				
				pastDate.setFullYear(pastDate.getFullYear() + years);
				var displayYears = ('0' + years).slice(-2); //works for 99 years!		

				var fixmonth = Date.DatePart('d',pastDate) > Date.DatePart('d',currentDate);
				
				var months = Date.DateDiff('m', pastDate, currentDate);
				if (fixmonth)
				{
					months--;
				}	
				
				var displayMonths = ('0' + months).slice(-2);
				
				var noclocks = displayYears + ' Years';
	
				switch(months){
					case 0:
						//no action no months skip
						break;
					case 1:
						noclocks += ', ' + months + ' Month';
						break;
					default: //more than one
						noclocks += ', ' + months + ' Months';
				}
								
				$('#year10su').html(displayYears.split('')[0]);
				$('#year1su').html(displayYears.split('')[1]);
				$('#year10sd').html(displayYears.split('')[0]);
				$('#year1sd').html(displayYears.split('')[1]);
				
				$('#month10su').html(displayMonths.split('')[0]);
				$('#month1su').html(displayMonths.split('')[1]);
				$('#month10sd').html(displayMonths.split('')[0]);
				$('#month1sd').html(displayMonths.split('')[1]);
							
				pastDate.setMonth(pastDate.getMonth() + months);
				
				var days = Date.DateDiff('d', pastDate, currentDate);

				switch(days){
					case 0:
						//no action no days skip
						break;
					case 1:
						noclocks += ' and ' + days + ' Day';
						break;
					default: //more than one
						noclocks += ' and ' + days + ' Days';
				}
				
				$('#noclocks').html(noclocks);
				
				// Calculate the difference in seconds between the future and current date
				var diff = currentDate.getTime() / 1000 - pastDate.getTime() / 1000;

				// Instantiate a countdown FlipClock
				var clock = $('.clock').FlipClock(diff, {
					clockFace: 'DailyCounter'
				});
				
				$('.clock').css("display","block");
			});