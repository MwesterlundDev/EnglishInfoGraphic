var rcs = (function () {
    return {

        addMinutes: function (date, minutes) {
            return new Date(date.getTime() + minutes * 60000);
        },

        getMinutesFromNow: function (date) {
            var self = this;

            var timeDifference = date.getTime() - acove.demo.demoNow.getTime();
            return timeDifference / 60000;
        },

        /**
         * Returns a string in Minutes:Seconds 
         * 
         * (No hours for now)
         * @param {Number} seconds 
         */
        clockFormat: function (seconds) {
            var minutes = Math.floor(seconds / 60)
            var seconds = seconds % 60;

            if (seconds < 10) {
                var seconds = "0" + seconds;
            }

            return minutes + ":" + seconds;
        },

        /**
         * find the index in array by the value of the field
         * @param {Array} array 
         * @param {String} field 
         * @param {Object} value 
         */
        findIndexByValue: function (array, field, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][field] == value) {
                    return i;
                }
            }

            return null;
        }
    }
})();