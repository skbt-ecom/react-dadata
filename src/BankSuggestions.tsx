import React, { ReactNode } from 'react';
import { BaseProps, BaseSuggestions } from './BaseSuggestions';
import { DaDataBank, DaDataBankStatus, DaDataBankType, DaDataSuggestion } from './types';
import { HighlightWords } from './HighlightWords';

type Dictionary = { [key: string]: any };

interface Props extends BaseProps<DaDataBank> {
  filterStatus?: DaDataBankStatus[];
  filterType?: DaDataBankType[];
  filterLocations?: Dictionary[];
  filterLocationsBoost?: Dictionary[];
}

export class BankSuggestions extends BaseSuggestions<DaDataBank, Props> {
  loadSuggestionsUrl = 'https://api-app.sovcombank.ru/v1/cache/dadata/bank';

  getLoadSuggestionsData = (): Record<string, unknown> => {
    const { count, filterStatus, filterType, filterLocations, filterLocationsBoost } = this.props;
    const { query } = this.state;

    const requestPayload: Record<string, unknown> = {
      query,
      count: count || 10,
    };

    // Ограничение по статусу организации
    if (filterStatus) {
      requestPayload.status = filterStatus;
    }

    // Ограничение по типу организации
    if (filterType) {
      requestPayload.type = filterType;
    }

    // Сужение области поиска
    if (filterLocations) {
      requestPayload.locations = filterLocations;
    }

    // Приоритет города при ранжировании
    if (filterLocationsBoost) {
      requestPayload.locations_boost = filterLocationsBoost;
    }

    return requestPayload;
  };

  protected getSuggestionKey = (suggestion: DaDataSuggestion<DaDataBank>): string => `${suggestion.data.bic}`;

  protected renderOption = (suggestion: DaDataSuggestion<DaDataBank>): ReactNode => {
    const { renderOption, highlightClassName } = this.props;
    const { query } = this.state;

    return renderOption ? (
      renderOption(suggestion, query)
    ) : (
      <div>
        <div
          className={
            suggestion.data.state.status === 'LIQUIDATED' ? 'react-dadata__suggestion--line-through' : undefined
          }
        >
          <HighlightWords
            highlightClassName={highlightClassName || 'react-dadata--highlighted'}
            words={this.getHighlightWords()}
            text={suggestion.value}
          />
        </div>
        <div className="react-dadata__suggestion-subtitle">
          {suggestion.data.bic && <div className="react-dadata__suggestion-subtitle-item">{suggestion.data.bic}</div>}
          {suggestion.data.address && suggestion.data.address.value && (
            <div className="react-dadata__suggestion-subtitle-item">
              <HighlightWords
                highlightClassName={highlightClassName || 'react-dadata--highlighted'}
                words={this.getHighlightWords()}
                text={suggestion.data.address.value}
              />
            </div>
          )}
        </div>
      </div>
    );
  };
}
