import { FlatList, StyleSheet } from 'react-native';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, deleteTask }) => {
  const renderTask = ({ item }) => {
    // OBLIGATORIO EL PARÁMETRO CON NOMBRE ITEM
    return <TaskItem task={item} deleteTask={deleteTask} />;
  };
  const parseTime = (timeStr) => {
    // Dividir la hora y el formato (AM/PM)
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes, seconds] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return new Date(1970, 0, 1, hours, minutes, seconds);
  };

  return (
    <FlatList
      style={styles.container}
      data={tasks.sort(
        (a, b) => parseTime(a.startTime) - parseTime(b.startTime)
      )}
      renderItem={renderTask}
      keyExtractor={(task) => task.id}
    />
  );
};
export default TaskList;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 6,
  },
});
