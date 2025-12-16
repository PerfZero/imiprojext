export function formatTimestamp(timestamp) {
    // Преобразуем timestamp из секунд в миллисекунды
    const date = new Date(timestamp * 1000);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const targetDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    const pad = (num) => String(num).padStart(2, "0");

    const timePart = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

    if (targetDay.getTime() === today.getTime()) {
        return timePart;
    } else if (targetDay.getTime() === yesterday.getTime()) {
        return `Вчера ${timePart}`;
    } else {
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        return `${day}.${month}.${year} ${timePart}`;
    }
}
