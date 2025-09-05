import { render, screen } from '@testing-library/react';
import InspeccionForm from '../InspeccionForm';
import { useAuth } from '../../auth/AuthContext';
import axios from 'axios';

jest.mock('../../auth/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('axios');

describe('InspeccionForm', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: { nombre: 'Test', usuario_id: 1 } });
    axios.get.mockResolvedValue({ data: [] });
  });

  test('muestra titulo en modo lectura', () => {
    render(<InspeccionForm nodoSeleccionado={{ id: 1 }} />);
    expect(screen.getByText(/resumen de inspecci\u00f3n/i)).toBeInTheDocument();
  });

  test('muestra boton en modo edicion', () => {
    render(
      <InspeccionForm nodoSeleccionado={{ id: 1 }} modo="edicion" />
    );
    expect(
      screen.getByRole('button', { name: /guardar inspecci\u00f3n/i })
    ).toBeInTheDocument();
  });
});