// PnPjsExample.tsx
import * as React from 'react';
import styles from './PnPjsExample.module.scss';
import { IPnPjsExampleProps } from './IPnPjsExampleProps';
import { getSP } from '../pnpjsConfig';
import { IFile } from './interfaces';
import { TextField, Toggle, Stack, Label, Link, Icon } from '@fluentui/react';

interface State {
  documents: IFile[];
  sitePages: IFile[];
  showDocuments: boolean;
  showSitePages: boolean;
  searchText: string;
  loading: boolean;
}

export default class PnPjsExample extends React.Component<IPnPjsExampleProps, State> {
  private _sp = getSP();

  constructor(props: IPnPjsExampleProps) {
    super(props);
    this.state = {
      documents: [],
      sitePages: [],
      showDocuments: true,
      showSitePages: true,
      searchText: '',
      loading: false,
    };
  }

  public componentDidMount(): void {
   void this._loadFiles();
  }

  private _loadFiles = async (): Promise<void> => {
    this.setState({ loading: true });

    const [documents, sitePages] = await Promise.all([
      this._loadLibrary('Documents'),
      this._loadLibrary('Site Pages'),
    ]);

    this.setState({
      documents,
      sitePages,
      loading: false,
    });
  };

  private _loadLibrary = async (library: 'Documents' | 'Site Pages'): Promise<IFile[]> => {
    try {
      const items = await this._sp.web.lists
        .getByTitle(library)
        .items
        .select('Id', 'FileLeafRef', 'File/Length')
        .expand('File')();

      return items.map((item: any) => ({
        Id: item.Id,
        Name: item.FileLeafRef,
        Size: item.File?.Length || 0,
        Library: library,
      }));
    } catch (error) {
      console.error(`Failed to load from ${library}:`, error);
      return [];
    }
  };

  private _onSearchChange = (_: any, newValue?: string) => {
    this.setState({ searchText: newValue || '' });
  };

  private _onToggleDocuments = (_: any, checked?: boolean): void => {
    this.setState({ showDocuments: checked ?? true });
  };

  private _onToggleSitePages = (_: any, checked?: boolean): void => {
    this.setState({ showSitePages: checked ?? true });
  };

  public render(): React.ReactElement<IPnPjsExampleProps> {
    const { documents, sitePages, showDocuments, showSitePages, searchText, loading } = this.state;

    const combinedItems = [
      ...(showDocuments ? documents : []),
      ...(showSitePages ? sitePages : []),
    ].filter((item) => item.Name.toLowerCase().includes(searchText.toLowerCase()));

    return (
      <div className={styles.pnPjsExample}>
        <Stack tokens={{ childrenGap: 10 }}>
          <Label>📁 Files from "Documents" and "Site Pages"</Label>

          <TextField
            placeholder="Search files"
            value={searchText}
            onChange={this._onSearchChange}
            onRenderPrefix={() => <Icon iconName="Search" style={{ marginLeft: 8 }} />}
          />

          <Stack
            horizontal
            wrap
            tokens={{ childrenGap: 16 }}
            styles={{
              root: {
                marginBottom: 10,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
              },
            }}
          >
            <Toggle
              label="Show Documents"
              checked={showDocuments}
              onChange={this._onToggleDocuments}
            />
            <Toggle
              label="Show Site Pages"
              checked={showSitePages}
              onChange={this._onToggleSitePages}
            />
          </Stack>

          {loading ? (
            <Label>Loading files...</Label>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>📄 Name</th>
                  <th style={{ textAlign: 'left' }}>Size (KB)</th>
                  <th style={{ textAlign: 'left' }}>Library</th>
                </tr>
              </thead>
              <tbody>
                {combinedItems.map((item) => (
                  <tr key={`${item.Library}-${item.Id}`}>
                    <td>
                      <Link
                        href={`${this.props.siteUrl}/${item.Library}/${encodeURIComponent(item.Name)}`}
                        target="_blank"
                      >
                        {item.Name}
                      </Link>
                    </td>
                    <td>{(item.Size / 1024).toFixed(2)}</td>
                    <td>{item.Library}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Stack>
      </div>
    );
  }
}
