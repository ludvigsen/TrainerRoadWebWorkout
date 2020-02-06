export async function getWorkout(id) {
  const response = await fetch(`https://www.trainerroad.com/api/workoutdetails/${id}`, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',

    /*body: {
        "first_name": this.firstName.value
      }*/
  }).then(response => response.json());
  return response.Workout;
}

export async function getWorkouts() {
  const response = await fetch('https://www.trainerroad.com/api/workouts', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then(response => response.json());
  return response.Workouts;
}
