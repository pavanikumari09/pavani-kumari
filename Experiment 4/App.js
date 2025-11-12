import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  Provider as PaperProvider,
  Appbar,
  TextInput,
  FAB,
  Card,
  Title,
  Paragraph,
  Checkbox,
  Menu,
  Button,
  Portal,
  Dialog,
  IconButton,
  Avatar,
  Chip,
  Text,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

const STORAGE_KEY = '@my_todo_tasks_v1';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function humanDate(ts) {
  if (!ts) return null;
  try {
    return format(new Date(ts), 'MMM d, yyyy');
  } catch (e) {
    return null;
  }
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | completed
  const [sort, setSort] = useState('newest'); // newest | oldest | alpha
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletedBackup, setDeletedBackup] = useState(null);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    // persist tasks
    save(tasks);
  }, [tasks]);

  async function load() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setTasks(JSON.parse(raw));
      } else {
        // seed example tasks
        const example = [
          {
            id: generateId(),
            title: 'Welcome — try this to-do app',
            notes: 'Tap the checkbox to complete. Swipe to delete (or use the trash icon).',
            completed: false,
            priority: 'medium',
            createdAt: Date.now(),
            dueDate: null,
          },
          {
            id: generateId(),
            title: 'Plan a short trip',
            notes: 'Pack light — check weather, book lodging',
            completed: false,
            priority: 'low',
            createdAt: Date.now() - 1000 * 60 * 60 * 24,
            dueDate: null,
          },
        ];
        setTasks(example);
      }
    } catch (e) {
      console.warn('Failed to load tasks', e);
    }
  }

  async function save(next) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to save tasks', e);
    }
  }

  function addTask(payload) {
    const t = {
      id: generateId(),
      title: payload.title.trim(),
      notes: payload.notes || '',
      completed: false,
      priority: payload.priority || 'low',
      createdAt: Date.now(),
      dueDate: payload.dueDate || null,
    };
    setTasks(prev => [t, ...prev]);
  }

  function updateTask(id, patch) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)));
  }

  function removeTask(id) {
    const t = tasks.find(x => x.id === id);
    setDeletedBackup(t || null);
    setTasks(prev => prev.filter(x => x.id !== id));
    // show undo via dialog briefly
    setDialogVisible(true);
  }

  function undoDelete() {
    if (deletedBackup) {
      setTasks(prev => [deletedBackup, ...prev]);
      setDeletedBackup(null);
    }
    setDialogVisible(false);
  }

  function clearCompleted() {
    const backup = tasks.filter(t => t.completed);
    if (backup.length === 0) return;
    setDeletedBackup({ bulk: true, items: backup });
    setTasks(prev => prev.filter(t => !t.completed));
    setDialogVisible(true);
  }

  function confirmDismissDialog() {
    // permanently dismiss backup
    setDeletedBackup(null);
    setDialogVisible(false);
  }

  function openEditor(task) {
    setEditingTask(task || { title: '', notes: '', priority: 'low', dueDate: null });
  }

  function saveEditor(data) {
    if (!data.title || data.title.trim() === '') return;
    if (data.id) {
      updateTask(data.id, { title: data.title, notes: data.notes, priority: data.priority, dueDate: data.dueDate });
    } else {
      addTask(data);
    }
    setEditingTask(null);
  }

  function filteredSortedTasks() {
    let list = tasks.slice();
    if (filter === 'active') list = list.filter(t => !t.completed);
    if (filter === 'completed') list = list.filter(t => t.completed);
    if (query && query.trim() !== '') {
      const q = query.toLowerCase();
      list = list.filter(t => (t.title || '').toLowerCase().includes(q) || (t.notes || '').toLowerCase().includes(q));
    }
    if (sort === 'newest') list.sort((a, b) => b.createdAt - a.createdAt);
    if (sort === 'oldest') list.sort((a, b) => a.createdAt - b.createdAt);
    if (sort === 'alpha') list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    return list;
  }

  const listData = filteredSortedTasks();

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safe}>
        <Appbar.Header>
          <Appbar.Content title="Tasks" subtitle="A clean, professional to‑do app" />
          <Appbar.Action icon="filter" onPress={() => setMenuVisible(true)} />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={<Appbar.Action icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
          >
            <Menu.Item title={`Filter: ${filter}`} onPress={() => { setFilter('all'); setMenuVisible(false); }} />
            <Menu.Item title="Show Active" onPress={() => { setFilter('active'); setMenuVisible(false); }} />
            <Menu.Item title="Show Completed" onPress={() => { setFilter('completed'); setMenuVisible(false); }} />
            <Menu.Item title="Clear Completed" onPress={() => { clearCompleted(); setMenuVisible(false); }} />
          </Menu>
        </Appbar.Header>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <View style={styles.searchRow}>
            <TextInput
              mode="outlined"
              placeholder="Search tasks..."
              value={query}
              onChangeText={setQuery}
              style={styles.search}
              left={<TextInput.Icon name="magnify" />}
              right={<TextInput.Icon name="close" onPress={() => setQuery('')} />}
            />
            <Menu
              visible={false}
            />
          </View>

          <View style={styles.controlsRow}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Chip selected={sort === 'newest'} onPress={() => setSort('newest')}>Newest</Chip>
              <Chip selected={sort === 'oldest'} onPress={() => setSort('oldest')}>Oldest</Chip>
              <Chip selected={sort === 'alpha'} onPress={() => setSort('alpha')}>A → Z</Chip>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Button onPress={() => { setFilter('all'); setSort('newest'); setQuery(''); }}>Reset</Button>
            </View>
          </View>

          <FlatList
            data={listData}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 12 }}
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                onToggleComplete={() => updateTask(item.id, { completed: !item.completed })}
                onEdit={() => openEditor(item)}
                onDelete={() => removeTask(item.id)}
                onLongPress={() => updateTask(item.id, { priority: cyclePriority(item.priority) })}
              />
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyBox}>
                <Title>No tasks — add one with the + button</Title>
                <Paragraph>Use the search, filters, or sorting to manage longer lists.</Paragraph>
              </View>
            )}
          />

          <FAB
            icon="plus"
            label="Add task"
            style={styles.fab}
            onPress={() => openEditor(null)}
          />

          <Portal>
            <EditorModal
              visible={!!editingTask}
              task={editingTask}
              onDismiss={() => setEditingTask(null)}
              onSave={saveEditor}
            />

            <Dialog visible={isDialogVisible} onDismiss={() => setDialogVisible(false)}>
              <Dialog.Title>Undo delete?</Dialog.Title>
              <Dialog.Content>
                <Paragraph>Task removed. You can undo this action.</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={confirmDismissDialog}>Dismiss</Button>
                <Button onPress={undoDelete}>Undo</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperProvider>
  );
}

function cyclePriority(p) {
  if (p === 'low') return 'medium';
  if (p === 'medium') return 'high';
  return 'low';
}

function TaskCard({ task, onToggleComplete, onEdit, onDelete, onLongPress }) {
  return (
    <Card style={styles.card} elevation={2}>
      <Card.Content style={styles.cardContent}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Checkbox
            status={task.completed ? 'checked' : 'unchecked'}
            onPress={onToggleComplete}
          />
          <View style={{ flex: 1 }}>
            <Title style={[styles.taskTitle, task.completed && styles.completedText]}>{task.title}</Title>
            {task.notes ? <Paragraph style={task.completed ? styles.completedText : null}>{task.notes}</Paragraph> : null}
            <View style={styles.metaRow}>
              <Chip compact onPress={onLongPress}>{task.priority?.toUpperCase()}</Chip>
              {task.dueDate ? <Text style={styles.due}>Due: {humanDate(task.dueDate)}</Text> : null}
              <Text style={styles.metaDate}>{humanDate(task.createdAt)}</Text>
            </View>
          </View>
          <View style={styles.cardButtons}>
            <IconButton icon="pencil" size={20} onPress={onEdit} />
            <IconButton icon="delete" size={20} onPress={onDelete} />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

function EditorModal({ visible, task, onDismiss, onSave }) {
  const [title, setTitle] = useState(task?.title || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const [priority, setPriority] = useState(task?.priority || 'low');
  const [dueDate, setDueDate] = useState(task?.dueDate || null);

  useEffect(() => {
    setTitle(task?.title || '');
    setNotes(task?.notes || '');
    setPriority(task?.priority || 'low');
    setDueDate(task?.dueDate || null);
  }, [task]);

  function save() {
    if (!title || title.trim() === '') return;
    onSave({ id: task?.id, title, notes, priority, dueDate });
  }

  if (!visible) return null;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={{ margin: 12 }}>
        <Dialog.Title>{task?.id ? 'Edit task' : 'New task'}</Dialog.Title>
        <Dialog.Content>
          <TextInput label="Title" value={title} onChangeText={setTitle} style={{ marginBottom: 8 }} />
          <TextInput label="Notes" value={notes} onChangeText={setNotes} multiline numberOfLines={3} style={{ marginBottom: 8 }} />
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <Button mode={priority === 'low' ? 'contained' : 'outlined'} onPress={() => setPriority('low')}>Low</Button>
            <Button mode={priority === 'medium' ? 'contained' : 'outlined'} onPress={() => setPriority('medium')}>Medium</Button>
            <Button mode={priority === 'high' ? 'contained' : 'outlined'} onPress={() => setPriority('high')}>High</Button>
          </View>
          {/* Simple due date input: free-text (improve with date-picker library if desired) */}
          <TextInput label="Due date (YYYY-MM-DD)" value={dueDate ? format(new Date(dueDate), 'yyyy-MM-dd') : ''} onChangeText={(t) => {
            if (!t) return setDueDate(null);
            const parsed = Date.parse(t);
            if (!isNaN(parsed)) setDueDate(parsed);
          }} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={save}>Save</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f6f7fb' },
  container: { flex: 1 },
  searchRow: { padding: 12 },
  search: { backgroundColor: 'white' },
  controlsRow: { paddingHorizontal: 12, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  card: { marginBottom: 10, borderRadius: 12, overflow: 'hidden' },
  cardContent: { paddingVertical: 6, paddingHorizontal: 10 },
  taskTitle: { fontSize: 16 },
  completedText: { textDecorationLine: 'line-through', color: '#7b7b7b' },
  metaRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  due: { marginLeft: 8, fontSize: 12, color: '#ff6b6b' },
  metaDate: { marginLeft: 12, fontSize: 12, color: '#9a9a9a' },
  cardButtons: { justifyContent: 'center' },
  emptyBox: { padding: 20, alignItems: 'center' },
  fab: { position: 'absolute', right: 16, bottom: 20 },
});
