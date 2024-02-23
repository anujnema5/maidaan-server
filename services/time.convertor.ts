// Use a unique name for the function to avoid conflicts

interface String {
    convertTime(): any;
}

String.prototype.convertTime = function () {
    const timeString = this.toString();
    const time = timeString.split(':');

    const [hours, minutes] = time

    if (
        isNaN(Number(hours))
        || isNaN(Number(minutes))
        || Number(hours) < 0
        || Number(hours) > 23
        || Number(minutes) < 0
        || Number(minutes) > 59
    ) {
        throw new Error('Invalid time format');
    }


    const numTime = Number(time.join(""))

    return numTime
}

