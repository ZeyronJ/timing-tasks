import { FlatList, StyleSheet } from 'react-native';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, deleteTask }) => {
  const renderTask = ({ item }) => {
    // OBLIGATORIO EL PARÁMETRO CON NOMBRE ITEM
    return <TaskItem task={item} deleteTask={deleteTask} />;
  };

  return (
    <FlatList
      style={styles.container}
      data={tasks}
      renderItem={renderTask}
      keyExtractor={(task) => task.id.toString()}
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
