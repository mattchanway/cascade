import Toast from 'react-bootstrap/Toast';

function TimecardAddedToast({jobName, jobDate}) {
  return (
    <Toast delay={5000} autohide>
      <Toast.Body>Timecard added for {jobName}, {jobDate}</Toast.Body>
    </Toast>
  );
}

export default TimecardAddedToast;