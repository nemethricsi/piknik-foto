-- Set all unbooked time slots to hidden
update time_slot set revealed = false where booking_id is null;
