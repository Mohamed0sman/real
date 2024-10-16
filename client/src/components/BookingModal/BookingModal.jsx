import React, { useContext, useState } from "react";
import { Modal, Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useMutation } from "react-query";
import '@mantine/core/styles.css';
import UserDetailContext from "../../context/UserDetailContext.js";
import { bookVisit } from "../../utils/api.js";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const BookingModal = ({ opened, setOpened, email, propertyId }) => {

  const [value, setValue] = useState(null);
  const {
    userDetails: { token },
    setUserDetails,
  } = useContext(UserDetailContext);

  const handleBookingSuccess = () => {
    toast.success("You have booked your visit", {
      position: "bottom-right",
    });
    setUserDetails((prev) => ({
      ...prev,
      bookings: [
        ...prev.bookings,
        {
          id: propertyId,
          date: dayjs(value).format("DD/MM/YYYY"),
        },
      ],
    }));
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: () => bookVisit(value, propertyId, email, token),
    onSuccess: () => handleBookingSuccess(),
    onError: ({ response }) => toast.error(response.data.message),
    onSettled: () => setOpened(false),
  });

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Select your date of visit"
      centered
    >
      <div className="flexColCenter" style={{gap: "1rem"}}>
      <DatePicker value={value} onChange={setValue} minDate={new Date()} 
      styles={{
        calendarHeader: {
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '1.25rem',
        },
        calendarHeaderControl: {
          border: 'none',
          backgroundColor: 'transparent',
          fontSize: '1.25rem',
          cursor: 'pointer',
        },
        calendarHeaderLevel: {
          fontWeight: 500,
          fontSize: '1.1rem',
        },
        day: {
          fontSize: '1rem',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0.2rem',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        },
        daySelected: {
          backgroundColor: '#1e90ff',
          color: 'white',
          fontWeight: 'bold',
        },
        dayOutside: {
          color: '#c0c0c0',
        },
        dayWeekend: {
          color: '#f25b5b', // Custom color for weekends
        },
        calendarHeaderControlIcon: {
          width: '24px',
          height: '24px',
        },
      }}

      />       
      
      
      
      <Button disabled={!value || isLoading} onClick={() => mutate()}>
         Book visit
        </Button>
      </div>
      
    </Modal>
  );
};

export default BookingModal;